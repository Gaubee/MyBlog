class KbIndex extends RouteElement {
    static get is() {
        return "kb-index";
    }
    static get properties() {
        return Object.assign({
            // This shouldn't be neccessary, but the Analyzer isn't picking up
            // Polymer.Element#rootPath
            rootPath: String,
        }, super.properties);
    }

    static get observers() {
        return [
            '_routePageChanged(routeData.page)',
        ];
    }
    constructor() {
        super();
    }

    _routePageChanged(page) {
        this.page = page || 'nav';

        // Close a non-persistent drawer when the page & route are changed.
        if (!this.$.drawer.persistent) {
            this.$.drawer.close();
        }
    }
    get URL_MAP() {
        if (!this._URL_MAP) {
            this._URL_MAP = Object.assign({
                "nav": "kb-nav",
                "account": "account/index-account",
                "app": "app/index-app",
                "tool": "tool/index-tool",
                "view1": "my-view1",
                "view2": "my-view2",
                "view3": "my-view3",
            }, super.URL_MAP);
        }
        return this._URL_MAP;
    }

    ready() {
        super.ready();
        window.routeJumpTo = (href) => {
            var $app_route = this.$.router;
            window.routeJumpTo = function (href) {
                $app_route.set("route.path", href);
                // $app_route.go(href);
            };
            window.routeJumpTo(href);
        }
        // 同步page与iron-page的selected属性
        const $iron_pages = this.$.iron_pages;
        // console.log("index $iron_pages", $iron_pages)
        $iron_pages.addEventListener('selected-changed', () => {
            if ($iron_pages.selected !== this.page) {
                this.page = $iron_pages.selected;
            }
        });
    }
}
window.customElements.define(KbIndex.is, KbIndex);