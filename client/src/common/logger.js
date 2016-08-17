export default {
  log(message, level = 'log') {
    const { logs } = this.state;

    this.setState({
      'logs': logs.concat([{ level, message }]),
    });
  },

  info(message, level = 'info') {
    this.log(message, level);
  },

  success(message, level = 'success') {
    this.log(message, level);
  },

  error(message, level = 'error') {
    this.log(message, level);
  },

}
