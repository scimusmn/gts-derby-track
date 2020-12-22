const NotFoundPage = () => {
  const isBrowser = typeof window !== 'undefined';
  if (isBrowser) {
    window.location.replace('/');
  }

  return null;
};

export default NotFoundPage;
