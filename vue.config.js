module.exports = {
	publicPath: process.env.NODE_ENV === 'production' ? process.env.VUE_APP_PUBLIC_PATH : '/',
	chainWebpack: config => {
		config.plugin('html').tap(args => {
			args[0].title = 'Vue Modal Trap Focus Example';

			return args;
		});
	},
	pwa: {
		name: 'Focus Trap App',
	},
};
