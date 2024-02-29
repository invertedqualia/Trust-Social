import React from 'react';

import type { List } from 'immutable';

import type { Account } from '../../types/resources';
import { autoPlayGif } from '../initial_state';

import { Skeleton } from './skeleton';

interface Props {
  account?: Account;
  others?: List<Account>;
  localDomain?: string;
  accuracy?: number;
}

export class DisplayName extends React.PureComponent<Props> {
  handleMouseEnter: React.ReactEventHandler<HTMLSpanElement> = ({
    currentTarget,
  }) => {
    if (autoPlayGif) {
      return;
    }

    const emojis =
      currentTarget.querySelectorAll<HTMLImageElement>('img.custom-emoji');

    emojis.forEach((emoji) => {
      const originalSrc = emoji.getAttribute('data-original');
      if (originalSrc != null) emoji.src = originalSrc;
    });
  };

  handleMouseLeave: React.ReactEventHandler<HTMLSpanElement> = ({
    currentTarget,
  }) => {
    if (autoPlayGif) {
      return;
    }

    const emojis =
      currentTarget.querySelectorAll<HTMLImageElement>('img.custom-emoji');

    emojis.forEach((emoji) => {
      const staticSrc = emoji.getAttribute('data-static');
      if (staticSrc != null) emoji.src = staticSrc;
    });
  };

  handlePercentColors = () => {
    if (this.props.accuracy && this.props.accuracy >= 80.0) return '#FFD700';
    if (this.props.accuracy && this.props.accuracy >= 60.0 && this.props.accuracy < 80.0) return '#C0C0C0';
    if (this.props.accuracy && this.props.accuracy >= 51.0 && this.props.accuracy < 60.0) return '#CD7F32';
    if (this.props.accuracy && this.props.accuracy >= 50.0 && this.props.accuracy < 51.0) return '#AAAAAA';
    if (this.props.accuracy && this.props.accuracy < 50.0) return '#656874';
  }

  render() {
    const { others, localDomain, accuracy } = this.props;

    let displayName: React.ReactNode,
      suffix: React.ReactNode,
      account: Account | undefined;

    if (others && others.size > 0) {
      account = others.first();
    } else if (this.props.account) {
      account = this.props.account;
    }

    if (others && others.size > 1) {
      displayName = others
        .take(2)
        .map((a) => (
          <bdi key={a.get('id')}>
            <strong
              className='display-name__html'
              dangerouslySetInnerHTML={{ __html: a.get('display_name_html') }}
            />
          </bdi>
        ))
        .reduce((prev, cur) => [prev, ', ', cur]);

      if (others.size - 2 > 0) {
        suffix = `+${others.size - 2}`;
      }
    } else if (account) {
      let acct = account.get('acct');

      if (!acct.includes('@') && localDomain) {
        acct = `${acct}@${localDomain}`;
      }

      displayName = (
        <bdi style={{ display: 'flex' }}>
          <strong
            className='display-name__html'
            dangerouslySetInnerHTML={{
              __html: account.get('display_name_html'),
            }}
          />
          <p style={{ marginLeft: '20px', color: 'black', padding: '0 5px', backgroundColor: this.handlePercentColors() }}>{accuracy}%</p>
        </bdi>
      );
      suffix = <span className='display-name__account'>@{acct}</span>;
    } else {
      displayName = (
        <bdi>
          <strong className='display-name__html'>
            <Skeleton width='10ch' />
          </strong>
        </bdi>
      );
      suffix = (
        <span className='display-name__account'>
          <Skeleton width='7ch' />
        </span>
      );
    }

    return (
      <span
        className='display-name'
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        {displayName} {suffix}
      </span>
    );
  }
}
