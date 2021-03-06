import React from 'react';
import { FooterActionsType, FooterStateType } from './Footer.container';
import './Footer.scss';
import appPackage from '../../../package.alias.json';
import moment from 'moment-timezone';

type FooterState = {};

type OwnProps = {};
type FooterPropsType = OwnProps &
  Partial<FooterActionsType> &
  Partial<FooterStateType>;

export default class Footer extends React.Component<
  FooterPropsType,
  FooterState
> {
  constructor(props: FooterPropsType | Readonly<FooterPropsType>) {
    super(props);
  }
  render() {
    return (
      <footer className="footer">
        <div className="dev-team">
          ©2020-{moment().format('YYYY')}{' '}
          <a
            href="https://github.com/orgs/remap-keys/teams/remap-team/members"
            target={'_blank'}
            rel={'noreferrer'}
          >
            Remap team.
          </a>
        </div>
        <div className="footer-contents">
          <span className="footer-content">
            <a
              href="https://docs.google.com/document/d/1Fo2-cbPcTNkckwJOl-YqnBuVeyREuYtyoY8mecdiUxE/edit"
              target={'_blank'}
              rel={'noreferrer'}
            >
              Terms of Use
            </a>
          </span>
          <span className="footer-content">
            <a
              href="https://discord.gg/uf7v5DruMB"
              target={'_blank'}
              rel={'noreferrer'}
            >
              User Community
            </a>
          </span>
        </div>
        <div className="app-version">v{appPackage.version}</div>
      </footer>
    );
  }
}
