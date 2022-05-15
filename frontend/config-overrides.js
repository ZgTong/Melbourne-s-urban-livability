import {addWebpackModuleRule} from "customize-cra";
import path from "path";

addWebpackModuleRule({
    test: /\.scss$/,
    use: [
        'style-loader',
        'css-loader',
        'sass-loader',
        {
            loader: 'sass-resources-loader',
            options: {
                resources: [
                    path.resolve(
                        __dirname,
                        './src/App.scss'
                    ),
                ],
            },
        }
    ]
})