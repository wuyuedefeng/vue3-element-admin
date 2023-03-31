module.exports = {
    plugins: {
        // pnpm i tailwindcss -D
        'tailwindcss': {},
        // pnpm i autoprefixer -D
        autoprefixer: {},
        // postcss-pxtorem 插件的版本需要 >= 5.0.0
        // 'postcss-pxtorem': {
        //   rootValue({ file }) {
        //     return file.indexOf('/vant/') !== -1 ? 37.5 : 75;
        //   },
        //   propList: ['*'],
        // },
        // pnpm i cssnano -D
        ...(process.env.NODE_ENV === 'production' ? { cssnano: {} } : {})
    },
}