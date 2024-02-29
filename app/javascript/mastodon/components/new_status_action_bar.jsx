import PropTypes from 'prop-types';

import { defineMessages, injectIntl } from 'react-intl';

import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { connect } from 'react-redux';

import distrustIcon from '../../images/icons/icon_not_trusted_btn.svg';
import trustIcon from '../../images/icons/icon_trusted_btn.svg';

import { IconButton } from './icon_button';


const messages = defineMessages({
  like: {id: 'status.like', defaultMessage: 'Like'},
  unlike: {id: 'status.unlike', defaultMessage: 'Remove like'},
  dislike: {id: 'status.dislike', defaultMessage: 'Dislike'},
  undislike: {id: 'status.undislike', defaultMessage: 'Remove dislike'},
  trust: {id: 'status.trust', defaultMessage: 'Trust'},
  unTrust: {id: 'status.untrust', defaultMessage: 'Remove trust'},
  distrust: {id: 'status.distrust', defaultMessage: 'Distrust'},
  unDistrust: {id: 'status.undistrust', defaultMessage: 'Remove distrust'},
});

const mapStateToProps = (state, { status }) => ({
  relationship: state.getIn(['relationships', status.getIn(['account', 'id'])]),
});

class NewStatusActionBar extends ImmutablePureComponent {

  static contextTypes = {
    router: PropTypes.object,
    identity: PropTypes.object,
  };

  static propTypes = {
    status: ImmutablePropTypes.map.isRequired,
    relationship: ImmutablePropTypes.map,
    onLike: PropTypes.func,
    onDislike: PropTypes.func,
    onFilter: PropTypes.func,
    withDismiss: PropTypes.bool,
    intl: PropTypes.object.isRequired,
    onTrust: PropTypes.func,
    onDistrust: PropTypes.func,
  };

  // Avoid checking props that are functions (and whose equality will always
  // evaluate to false. See react-immutable-pure-component for usage.
  updateOnProps = [
    'status',
    'relationship',
    'withDismiss',
  ];

  handleLikeClick = () => {
    if (this.props.status.get('disliked')) {
      this.props.onDislike(this.props.status);
      this.props.onLike(this.props.status);
    } else {
      this.props.onLike(this.props.status);
    }
  };

  handleDislikeClick = () => {
    if (this.props.status.get('liked')) {
      this.props.onLike(this.props.status);
      this.props.onDislike(this.props.status);
    } else {
      this.props.onDislike(this.props.status);
    }
  };

  handleTrustClick = () => {
    if (this.props.status.get('distrusted')) {
      this.props.onDistrust(this.props.status);
      this.props.onTrust(this.props.status);
    } else {
      this.props.onTrust(this.props.status);
    }
  };

  handleDistrustClick = () => {
    if (this.props.status.get('trusted')) {
      this.props.onTrust(this.props.status);
      this.props.onDistrust(this.props.status);
    } else {
      this.props.onDistrust(this.props.status);
    }
  };

  render () {
    const { status, intl } = this.props;

    const filterButton = this.props.onFilter && (
      <IconButton className='status__action-bar__button' title={intl.formatMessage(messages.hide)} icon='eye' onClick={this.handleHideClick} />
    );

    return (
      <div className='status__action-bar'>
        <IconButton className='status__action-bar__button like-icon' active={status.get('liked')} title='Like' icon='thumbs-up' onClick={this.handleLikeClick} />
        <IconButton className='status__action-bar__button dislike-icon' active={status.get('disliked')} title='Dislike' icon='thumbs-down' onClick={this.handleDislikeClick} />

        <div className='iconButton-wrapper' onClick={this.handleTrustClick}>
          <img src={trustIcon} alt={trustIcon} style={{ marginRight: '5px', filter: status.get('trusted') ? 'invert(31%) sepia(86%) saturate(1945%) hue-rotate(86deg) brightness(93%) contrast(102%)' : 'none' }} />
          <p>I trust this content</p>
        </div>

        <div className='iconButton-wrapper' onClick={this.handleDistrustClick}>
          <img src={distrustIcon} alt={distrustIcon} style={{ marginRight: '5px', filter: status.get('distrusted') ? 'invert(32%) sepia(85%) saturate(2511%) hue-rotate(343deg) brightness(84%) contrast(98%)' : 'none'}} />
          <p>I do not trust this content</p>
        </div>

        {filterButton}
      </div>
    );
  }

}

export default connect(mapStateToProps)(injectIntl(NewStatusActionBar));
