class KbAccount extends RouteElement {
    static get is() {
        return "kb-account";
    }

    static get observers() {
        return ["_routePageChanged(routeData.page)"];
    }
    constructor() {
        super("../");
        this._axis = "Y";
        this._duration = 800;
        this.addEventListener("switch-page-start", () => {
            this.updateStyles({
                "--account-show-paper-progress": "block"
            });
        });
        this.addEventListener("switch-page-end", () => {
            this.updateStyles({
                "--account-show-paper-progress": "none"
            });
        });
    }
    ready() {
        super.ready();
        // 同步page与iron-page的selected属性
        const $iron_pages = this.$.iron_pages;
        if ($iron_pages) {
            $iron_pages.addEventListener('selected-changed', ( /**@type {Event}*/ e) => {
                e.cancelBubble = true;
                if ($iron_pages.selected !== this.page) {
                    // console.log("account page", $iron_pages.selected, this.page)
                    this.page = $iron_pages.selected;
                }
            });
        }
    }
    _show_page(page) {
        page && page.classList.add("iron-selected");
    }
    _hide_page(page) {
        page && page.classList.remove("iron-selected");
    }
    get ani_config() {
        if (!this._ani_config) {
            const scale = (500 + 200) / 500;
            const show_to_hide = [{
                    transform: `translateZ(-200px) rotate${this._axis}(0deg) scale(${scale})`,
                    offset: 0
                },
                {
                    transform: `translateZ(-100px) rotate${this._axis}(0deg) scale(${scale})`,
                    offset: 0.15
                },
                {
                    transform: `translateZ(-100px) rotate${this._axis}(180deg) scale(${scale})`,
                    offset: 0.65
                },
                {
                    transform: `translateZ(-200px) rotate${this._axis}(180deg) scale(${scale})`,
                    offset: 1
                }
            ];

            const hide_to_show = [{
                    transform: `translateZ(-200px) rotate${this._axis}(180deg) scale(${scale})`,
                    offset: 0
                },
                {
                    transform: `translateZ(-100px) rotate${this._axis}(180deg) scale(${scale})`,
                    offset: 0.15
                },
                {
                    transform: `translateZ(-100px) rotate${this._axis}(360deg) scale(${scale})`,
                    offset: 0.65
                },
                {
                    transform: `translateZ(-200px) rotate${this._axis}(360deg) scale(${scale})`,
                    offset: 1
                }
            ];
            var timing = {
                duration: this._duration,
                iterations: 1,
                easing: "ease-in-out"
                // fill: 'forwards'
            };
            this._ani_config = {
                hide: show_to_hide,
                show: hide_to_show,
                timing: timing
            };
        }
        return this._ani_config;
    }
    _ani_old_page($old_page, $new_page, cb) {
        this._show_page($old_page);
        this._hide_page($new_page);
        var ani_config = this.ani_config;

        var ani = $old_page.animate(ani_config.hide, ani_config.timing);
        //进入隐藏状态
        setTimeout(() => {
            this._hide_page($old_page);
        }, 0.4 * ani_config.timing.duration);

        ani.onfinish = e => {
            this._hide_page($old_page);
            $new_page && this._show_page($new_page);
            cb && cb.call(this, e);
        };
    }
    _ani_new_page($new_page, $old_page, cb) {
        // self._show_page($new_page);
        this._hide_page($new_page);
        this._hide_page($old_page);
        var ani_config = this.ani_config;

        //进入显示状态
        setTimeout(() => {
            this._show_page($new_page);
        }, 0.4 * ani_config.timing.duration);

        if ($new_page) {
            var ani = $new_page.animate(ani_config.show, ani_config.timing);
            ani.onfinish = cb;
        }
    }
    _ani_pages($new_page, $old_page, is_delay, cb) {
        if (is_delay) {
            if ($old_page) {
                if (isFinite(is_delay)) {
                    this._ani_old_page($old_page, $new_page);
                    $new_page &&
                        setTimeout(
                            this._ani_new_page($new_page, null, cb),
                            is_delay
                        );
                } else {
                    this._ani_old_page($old_page, $new_page, () => {
                        $new_page && this._ani_new_page($new_page, null, cb);
                    });
                }
            } else if ($new_page) {
                this._ani_new_page($new_page, null, cb);
            }
        } else {
            if ($old_page) {
                this._ani_old_page($old_page, $new_page);
            }
            this._ani_new_page($new_page, null, cb);
        }
    }
    attributeChangedCallback(key_name, old_value, new_value) {
        super.attributeChangedCallback(key_name, old_value, new_value);
        if (key_name !== "page") {
            return false;
        }
        var $iron_pages = this.shadowRoot.querySelector("iron-pages");
        if (old_value) {
            var $old_page = $iron_pages.querySelector(
                "[name=" + old_value + "]"
            );
        }
        if (new_value) {
            var $new_page = $iron_pages.querySelector(
                "[name=" + new_value + "]"
            );
        }

        this._ani_pages($new_page, $old_page);
    }

    _routePageChanged(page) {
        this.page = page || "login";
    }
    get URL_MAP() {
        if (!this._URL_MAP) {
            this._URL_MAP = Object.assign({
                login: "login",
                register: "register",
                findpwd: "findpwd"
            }, super.URL_MAP);
        }
        return this._URL_MAP;
    }
    _showPage404() {
        // iron-pages
        this.parentNode.selected = "view404";
    }
}
window.customElements.define(KbAccount.is, KbAccount);