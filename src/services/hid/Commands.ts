import {
  ICommandRequest,
  ICommandResponse,
  ICommandResponseHandler,
} from './WebHid';
import { ICommand } from './Hid';

export abstract class AbstractCommand<
  TRequest extends ICommandRequest,
  TResponse extends ICommandResponse
> implements ICommand {
  private readonly request: TRequest;
  private readonly responseHandler: ICommandResponseHandler<TResponse>;

  static OUTPUT_REPORT_ID: number = 0x00;

  constructor(
    request: TRequest,
    responseHandler: ICommandResponseHandler<TResponse>
  ) {
    this.request = request;
    this.responseHandler = responseHandler;
  }

  protected getRequest(): TRequest {
    return this.request;
  }

  protected getResponseHandler(): ICommandResponseHandler<TResponse> {
    return this.responseHandler;
  }

  abstract createReport(): Uint8Array;
  // eslint-disable-next-line no-unused-vars
  abstract createResponse(resultArray: Uint8Array): TResponse;
  // eslint-disable-next-line no-unused-vars
  abstract isSameRequest(resultArray: Uint8Array): boolean;

  async sendReport(device: any): Promise<void> {
    try {
      const outputReport = this.createReport();
      await device.sendReport(AbstractCommand.OUTPUT_REPORT_ID, outputReport);
    } catch (error) {
      await this.getResponseHandler()({
        success: false,
        error: 'Sending report failed.',
        cause: error,
      });
    }
  }

  async handleInputReport(data: any): Promise<void> {
    const resultArray = new Uint8Array(data.data.buffer);
    await this.getResponseHandler()({
      success: true,
      response: this.createResponse(resultArray),
    });
  }

  canHandleInputReport(data: any): boolean {
    const resultArray = new Uint8Array(data.data.buffer);
    return this.isSameRequest(resultArray);
  }
}

export type ILightingValue =
  | 'qmkBacklightBrightness'
  | 'qmkBacklightEffect'
  | 'qmkRgblightBrightness'
  | 'qmkRgblightEffect'
  | 'qmkRgblightEffectSpeed'
  | 'qmkRgblightColor';

// eslint-disable-next-line no-unused-vars
export const LightingValue: { [p in ILightingValue]: number } = {
  qmkBacklightBrightness: 0x09,
  qmkBacklightEffect: 0x0a,
  qmkRgblightBrightness: 0x80,
  qmkRgblightEffect: 0x81,
  qmkRgblightEffectSpeed: 0x82,
  qmkRgblightColor: 0x83,
};

export interface ILightingGetValueRequest extends ICommandRequest {
  lightingValue: ILightingValue;
}

export interface ILightingGetValueResponse extends ICommandResponse {
  value1: number;
  value2: number;
}

export class LightingGetValueCommand extends AbstractCommand<
  ILightingGetValueRequest,
  ILightingGetValueResponse
> {
  createReport(): Uint8Array {
    const lightingValue = LightingValue[this.getRequest().lightingValue];
    return new Uint8Array([0x08, lightingValue]);
  }

  createResponse(resultArray: Uint8Array): ILightingGetValueResponse {
    return {
      value1: resultArray[2],
      value2: resultArray[3],
    };
  }

  isSameRequest(resultArray: Uint8Array): boolean {
    return (
      resultArray[0] === 0x08 &&
      resultArray[1] === LightingValue[this.getRequest().lightingValue]
    );
  }
}

export interface ILightingSetValueRequest extends ICommandRequest {
  lightingValue: ILightingValue;
  value1: number;
  value2: number;
}

export interface ILightingSetValueResponse extends ICommandResponse {
  value1: number;
  value2: number;
}

export class LightingSetValueCommand extends AbstractCommand<
  ILightingSetValueRequest,
  ILightingSetValueResponse
> {
  createReport(): Uint8Array {
    const lightingValue = LightingValue[this.getRequest().lightingValue];
    return new Uint8Array([
      0x07,
      lightingValue,
      this.getRequest().value1,
      this.getRequest().value2,
    ]);
  }

  createResponse(resultArray: Uint8Array): ILightingSetValueResponse {
    return {
      value1: resultArray[2],
      value2: resultArray[3],
    };
  }

  isSameRequest(resultArray: Uint8Array): boolean {
    const lightingValue = LightingValue[this.getRequest().lightingValue];
    return (
      resultArray[0] === 0x07 &&
      resultArray[1] === lightingValue &&
      resultArray[2] === this.getRequest().value1 &&
      resultArray[3] === this.getRequest().value2
    );
  }
}

export interface IDynamicKeymapGetKeycodeRequest extends ICommandRequest {
  layer: number;
  row: number;
  column: number;
}

export interface IDynamicKeymapGetKeycodeResponse extends ICommandResponse {
  layer: number;
  row: number;
  column: number;
  code: number;
}

export class DynamicKeymapGetKeycodeCommand extends AbstractCommand<
  IDynamicKeymapGetKeycodeRequest,
  IDynamicKeymapGetKeycodeResponse
> {
  createReport(): Uint8Array {
    const req = this.getRequest();
    return new Uint8Array([0x04, req.layer, req.row, req.column]);
  }

  createResponse(resultArray: Uint8Array): IDynamicKeymapGetKeycodeResponse {
    const req = this.getRequest();
    const code = (resultArray[4] << 8) | resultArray[5];
    return {
      layer: req.layer,
      row: req.row,
      column: req.column,
      code,
    };
  }

  isSameRequest(resultArray: Uint8Array): boolean {
    const req = this.getRequest();
    return (
      resultArray[0] === 0x04 &&
      resultArray[1] === req.layer &&
      resultArray[2] === req.row &&
      resultArray[3] === req.column
    );
  }
}

export interface IDynamicKeymapSetKeycodeRequest extends ICommandRequest {
  layer: number;
  row: number;
  column: number;
  code: number;
}

export interface IDynamicKeymapSetKeycodeResponse extends ICommandResponse {
  layer: number;
  row: number;
  column: number;
  code: number;
}

export class DynamicKeymapSetKeycodeCommand extends AbstractCommand<
  IDynamicKeymapSetKeycodeRequest,
  IDynamicKeymapSetKeycodeResponse
> {
  createReport(): Uint8Array {
    const req = this.getRequest();
    return new Uint8Array([
      0x05,
      req.layer,
      req.row,
      req.column,
      req.code >> 8,
      req.code & 0xff,
    ]);
  }

  createResponse(resultArray: Uint8Array): IDynamicKeymapSetKeycodeResponse {
    const req = this.getRequest();
    const code = (resultArray[4] << 8) | resultArray[5];
    return {
      layer: req.layer,
      row: req.row,
      column: req.column,
      code,
    };
  }

  isSameRequest(resultArray: Uint8Array): boolean {
    const req = this.getRequest();
    return (
      resultArray[0] === 0x05 &&
      resultArray[1] === req.layer &&
      resultArray[2] === req.row &&
      resultArray[3] === req.column &&
      resultArray[4] === req.code >> 8 &&
      resultArray[5] === (req.code & 0xff)
    );
  }
}

export interface IDynamicKeymapGetLayerCountResponse extends ICommandResponse {
  value: number;
}

export class DynamicKeymapGetLayerCountCommand extends AbstractCommand<
  ICommandRequest,
  IDynamicKeymapGetLayerCountResponse
> {
  createReport(): Uint8Array {
    return new Uint8Array([0x11]);
  }

  createResponse(resultArray: Uint8Array): IDynamicKeymapGetLayerCountResponse {
    return {
      value: resultArray[1],
    };
  }

  isSameRequest(resultArray: Uint8Array): boolean {
    return resultArray[0] === 0x11;
  }
}

export interface IDynamicKeymapReadBufferRequest extends ICommandRequest {
  offset: number;
  size: number;
}

export interface IDynamicKeymapReadBufferResponse extends ICommandResponse {
  offset: number;
  size: number;
  buffer: Uint8Array;
}

export class DynamicKeymapReadBufferCommand extends AbstractCommand<
  IDynamicKeymapReadBufferRequest,
  IDynamicKeymapReadBufferResponse
> {
  createReport(): Uint8Array {
    const req = this.getRequest();
    return new Uint8Array([0x12, req.offset >> 8, req.offset & 0xff, req.size]);
  }

  createResponse(resultArray: Uint8Array): IDynamicKeymapReadBufferResponse {
    const offset = (resultArray[1] << 8) | resultArray[2];
    const size = resultArray[3];
    return {
      offset,
      size,
      buffer: resultArray.slice(4),
    };
  }

  isSameRequest(resultArray: Uint8Array): boolean {
    const req = this.getRequest();
    return (
      resultArray[0] === 0x12 &&
      resultArray[1] === req.offset >> 8 &&
      resultArray[2] === (req.offset & 0xff) &&
      resultArray[3] === req.size
    );
  }
}
