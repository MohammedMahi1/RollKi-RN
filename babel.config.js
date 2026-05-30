module.exports = function (api) {
  api.cache(true);
  let plugins = [];

  plugins.push('react-native-worklets/plugin');

  return {
    presets: ['babel-preset-expo'],

    plugins:[
      ['inline-import', { extensions: ['.sql'] }] // <-- Add this line
    ],
  };
};
