/* eslint-disable no-console */
import logSymbols from 'log-symbols';

export default {
  debug(message: string, rest?: any) {
    console.log(logSymbols.info, message, JSON.stringify(rest));
  },

  trace(message: string, rest?: any) {
    console.log(
      logSymbols.info,
      `[${new Date().toJSON()}]`,
      message,
      JSON.stringify(rest)
    );
  },

  info(message: string, rest?: any) {
    console.log(logSymbols.info, message, JSON.stringify(rest));
  },

  warning(message: string, rest?: any) {
    console.error(logSymbols.warning, message, JSON.stringify(rest));
  },

  error(message: string, rest?: any) {
    console.error(logSymbols.error, message, JSON.stringify(rest));
  },

  success(message: string, rest?: any) {
    console.log(logSymbols.success, message, JSON.stringify(rest));
  }
};
