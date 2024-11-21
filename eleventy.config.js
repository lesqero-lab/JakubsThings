import { EleventyI18nPlugin } from "@11ty/eleventy";

export default function (eleventyConfig) {
    eleventyConfig.setInputDirectory("_src");
	eleventyConfig.addPlugin(EleventyI18nPlugin, {
        defaultLanguage: "en",
    });

}

