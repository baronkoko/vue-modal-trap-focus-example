module.exports = {
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
