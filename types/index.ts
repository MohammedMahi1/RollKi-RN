export interface ArticleType {
    title: string;
    description: string;
    extract: string;
    thumbnail: {
        source: string;
        width: number;
        height: number;
    };
    content_urls: {
        mobile: {
            page: string;
        };
    };
    originalimage:any
}
// {
//   "title": "Axolotl",
//   "description": "Species of amphibian",
//   "extract": "The axolotl is a paedomorphic salamander closely related to the tiger salamander...",
//   "thumbnail": {
//     "source": "https://upload.wikimedia.org/.../axolotl.jpg",
//     "width": 320,
//     "height": 240
//   },
//   "content_urls": {
//     "mobile": { "page": "https://en.m.wikipedia.org/wiki/Axolotl" }
//   }
// }