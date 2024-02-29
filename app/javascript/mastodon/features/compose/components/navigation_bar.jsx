import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';

import { Link } from 'react-router-dom';

import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';

import { Avatar } from '../../../components/avatar';

import ActionBar from './action_bar';

import GoldBadge from '../../../../images/icons/gold_badge.png'
import SilverBadge from '../../../../images/icons/silver_badge.png'
import BronzeBadge from '../../../../images/icons/bronze_badge.png'
import LeadBadge from '../../../../images/icons/lead_badge.png'
import BlackBadge from '../../../../images/icons/black_badge.png'

export default class NavigationBar extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map.isRequired,
    onLogout: PropTypes.func.isRequired,
    onClose: PropTypes.func,
  };

  accuracy = this.props.account?.get('accuracy');

  handleAccuracy = () => {
    if (this.accuracy && this.accuracy >= 80.0) return GoldBadge;
    if (this.accuracy && this.accuracy >= 60.0 && this.accuracy < 80.0) return SilverBadge;
    if (this.accuracy && this.accuracy >= 51.0 && this.accuracy < 60.0) return BronzeBadge;
    if (this.accuracy && this.accuracy >= 50.0 && this.accuracy < 51.0) return LeadBadge;
    if (this.accuracy && this.accuracy < 50.0) return BlackBadge;
  }

  handlePercentColors = () => {
    if (this.accuracy && this.accuracy >= 80.0) return '#FFD700';
    if (this.accuracy && this.accuracy >= 60.0 && this.accuracy < 80.0) return '#C0C0C0';
    if (this.accuracy && this.accuracy >= 51.0 && this.accuracy < 60.0) return '#CD7F32';
    if (this.accuracy && this.accuracy >= 50.0 && this.accuracy < 51.0) return '#AAAAAA';
    if (this.accuracy && this.accuracy < 50.0) return '#656874';
  }

  render () {
    const username = this.props.account.get('acct');
    return (
      <div className='navigation-bar'>
        <Link to={`/@${username}`}>
          <span style={{ display: 'none' }}>{username}</span>
          {this.accuracy !== undefined && <img src={this.handleAccuracy()} alt={this.handleAccuracy()} style={{ position: 'absolute', top: '106px', left: '36px', width: '14%', zIndex: 1 }} />}
          <Avatar account={this.props.account} size={46} />
        </Link>

        <div className='navigation-bar__profile'>
          <span style={{ display: 'flex' }}>
            <Link to={`/@${username}`}>
              <strong className='navigation-bar__profile-account'>@{username}</strong>
            </Link>
            <p style={{ marginLeft: '20px', color: 'black', padding: '0 5px', backgroundColor: this.handlePercentColors() }}>{this.accuracy}%</p>
          </span>

          <span>
            <a href='/settings/profile' className='navigation-bar__profile-edit'><FormattedMessage id='navigation_bar.edit_profile' defaultMessage='Edit profile' /></a>
          </span>
        </div>

        <div className='navigation-bar__actions'>
          <ActionBar account={this.props.account} onLogout={this.props.onLogout} />
        </div>
      </div>
    );
  }

}
