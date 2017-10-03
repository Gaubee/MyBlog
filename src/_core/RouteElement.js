class RouteElement extends Polymer.Element {
    constructor(path_to_root = "") {
        super();
        this.path_to_root = path_to_root;
        console.log(
            ["%cINIT", "%c" + this.tagName, path_to_root].join(" "),
            "background-color:blue;color:#FFF",
            "color:green"
        );
    }
    static get properties() {
        return {
            page: {
                type: String,
                reflectToAttribute: true,
                observer: "_switchPage"
            },
            route: Object,
            routeData: Object,
            subroute: String
        };
    }
    static get observers() {
        return [
            // "_routePrefixChanged(route.prefix)",
            "_routePageChanged(routeData.page)"
        ];
    }
    get URL_MAP() {
        return {
            view404: this.path_to_root + "my-view404"
        };
    }

    ready() {
        super.ready();
        this._route_prefix = this.route.prefix;
        console.log("%c" + this.tagName, "color:green", this.route);
    }
    get URL_INDEX(){return ""};
    _routePageChanged(page) {
        this.page = page || this.URL_INDEX;
    }
    _switchPage(page, old_page) {
        console.log(
            [
                "%c" + this.tagName,
                "%c" + page,
                "%c" + old_page,
                this.route.prefix
            ].join(" "),
            "color:green",
            "color:blue",
            "color:grey"
        );
        if (this._route_prefix !== undefined) {
            if (this.route.prefix !== this._route_prefix) {
                console.log("%cleaved page!", "color:red");
                return;
            }
        }
        if (this.getRootNode) {
            const rootNode = this.getRootNode();
            const hostNode = rootNode.host;
            if (hostNode) {
                const name = hostNode.getAttribute("name");
                if (name) {
                    const pagesNode = hostNode.parentNode;
                    if (pagesNode.selected && pagesNode.selected !== name) {
                        console.log("%cleaved page!", "color:red");
                        return;
                    }
                    console.log([pagesNode.selected, name].join(" "));
                }
            }
        }

        // console.log(this, this.routeData, page, old_page);
        const URL_MAP = this.URL_MAP;
        const page_url = this.URL_MAP[page];
        if (!page_url) {
            return this._showPage404();
        }
        // Load page import on demand. Show 404 page if fails
        const resolvedPageUrl = this.resolveUrl(page_url + ".html");

        const detail = {
            new_page: page,
            old_page
        };

        this.dispatchEvent(
            new CustomEvent("switch-page-start", {
                detail
            })
        );
        Polymer.importHref(
            resolvedPageUrl,
            () => {
                // this.routeData.page
                this.dispatchEvent(
                    new CustomEvent("switch-page-success", {
                        detail
                    })
                );
                this.dispatchEvent(
                    new CustomEvent("switch-page-end", {
                        detail
                    })
                );
            },
            () => {
                this.dispatchEvent(
                    new CustomEvent("switch-page-error", {
                        detail
                    })
                );
                this.dispatchEvent(
                    new CustomEvent("switch-page-end", {
                        detail
                    })
                );
                this._showPage404();
            },
            true
        );
    }
    _showPage404() {
        this.page = "view404";
    }
}
