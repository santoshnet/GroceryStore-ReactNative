import FlashMessage, {showMessage} from 'react-native-flash-message';

const showError = message => {
  showMessage({
    type: 'danger',
    icon: 'danger',
    message,
  });
};

const showSuccess = message => {
  showMessage({
    type: 'success',
    icon: 'success',
    message,
  });
};

const alertmessages = {
  showError,
  showSuccess,
};

export default alertmessages;
