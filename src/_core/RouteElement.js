class RouteElement extends Polymer.Element {
    constructor(path_to_root = "") {
        super();
        this.path_to_root = path_to_root;
    }
    static get properties() {
        return {
            page: {
                type: String,
                reflectToAttribute: true,
                observer: "_switchPage"
            },
            routeData: Object,
            subroute: String,
        };
    }
    // static get observers() {
    //     return ["_routePageChanged(routeData.page)"];
    // }
    get URL_MAP() {
        return {
            view404: this.path_to_root + "my-view404",
        };
    }
    _switchPage(...args) {
        const URL_MAP = this.URL_MAP;
        const page = args[0];
        const page_url = this.URL_MAP[page];
        if(!page_url){
            return this._showPage404();
        }
        // Load page import on demand. Show 404 page if fails
        const resolvedPageUrl = this.resolveUrl(page_url + ".html");

        this.dispatchEvent(new Event('switch-page-start'))
        Polymer.importHref(resolvedPageUrl, () => {
            // this.routeData.page
            this.dispatchEvent(new Event('switch-page-success'))
            this.dispatchEvent(new Event('switch-page-end'))
        }, () => {
            this.dispatchEvent(new Event('switch-page-error'))
            this.dispatchEvent(new Event('switch-page-end'))
            this._showPage404()
        }, true);
    }
    _showPage404() {
        this.page = "view404";
    }
}