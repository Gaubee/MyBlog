class KbApp extends RouteElement {
    static get is() {
        return "kb-app";
    }
    static get properties() {
        return Object.assign(
            {
                wideLayout: {
                    type: Boolean,
                    value: false,
                    observer: "onLayoutChange"
                },
                child_pages: {
                    type: Array,
                    value: () => {
                        return [
                            {
                                name: "apps",
                                title: "我的应用",
                                icon: "device:widgets"
                            },
                            {
                                name: "panle",
                                title: "监控面板",
                                icon: "timeline"
                            },
                            {
                                name: "friends",
                                title: "我的同僚",
                                icon: "social:people"
                            },
                            {
                                name: "setting",
                                title: "设置",
                                icon: "settings"
                            }
                        ];
                    }
                }
            },
            super.properties
        );
        // return {
        //     selectedTabName: {
        //         type: String,
        //         reflectToAttribute: true,
        //     },
        //     viewPage: {
        //         type: String,
        //         observer: '_switchPages'
        //     },
        //     wideLayout: {
        //         type: Boolean,
        //         value: false,
        //         observer: 'onLayoutChange',
        //     },
        //     child_pages: {
        //         type: Array,
        //         value: () => {
        //             return [{
        //                     name: "apps",
        //                     title: "我的应用",
        //                     icon: "device:widgets"
        //                 },
        //                 {
        //                     name: "panle",
        //                     title: "监控面板",
        //                     icon: "timeline"
        //                 },
        //                 {
        //                     name: "friends",
        //                     title: "我的同僚",
        //                     icon: "social:people"
        //                 },
        //                 {
        //                     name: "setting",
        //                     title: "设置",
        //                     icon: "settings"
        //                 }
        //             ];
        //         }
        //     }
        // }
    }
    // static get observers() {
    //     return [
    //         "_routePageChanged(routeData.page)",
    //         // '_bind_routePage_to_selectedTabName(routeData.page)',
    //         // '_bind_selectedTabName_to_viewPage(selectedTabName)'
    //     ]

    // }
    // _routeJumpTo(e) {
    //     var $app_route = this.$.router;
    //     this._routeJumpTo = (e) => {
    //         var href = e.target.name;
    //         $app_route.set("route.path", href);
    //     };
    //     this._routeJumpTo(e);
    // }

    onLayoutChange(wide) {
        var drawer = this.$.drawer;
        if (wide && drawer.opened) {
            drawer.opened = false;
        }
    }
    closeDrawer() {
        this.$.drawer.opened = false;
    }
    // _bind_routePage_to_selectedTabName(routePage) {
    //     this.selectedTabName = routePage || 'apps';
    // }
    // _bind_selectedTabName_to_viewPage(selectedTabName) {
    //     this.viewPage = this.selectedTabName;
    // }

    get URL_INDEX() {
        return "apps";
    }
    get URL_MAP() {
        if (!this._URL_MAP) {
            this._URL_MAP = Object.assign(
                {
                    apps: "apps",
                    panle: "panle",
                    friends: "friends",
                    setting: "setting"
                },
                super.URL_MAP
            );
        }
        return this._URL_MAP;
    }
    // _switchPage(...args) {
    //     super._switchPage(...args);
    //     debugger
    // }
    // _switchPages(page, old_page) {
    //     var page_url = {
    //         "view404": "../my-view404",
    //         "apps": "apps",
    //         "panle": "panle",
    //         "friends": "friends",
    //         "setting": "setting"
    //     }[page];
    //     // Load page import on demand. Show 404 page if fails

    //     var resolvedPageUrl = this.resolveUrl(page_url + '.html');
    //     // 显示加载进入条
    //     this.updateStyles({
    //         "--app-show-paper-progress": "block"
    //     });

    //     Polymer.importHref(resolvedPageUrl, () => {
    //         this.updateStyles({
    //             "--app-show-paper-progress": "none"
    //         });
    //         // 渲染进程ID
    //         var current_render_process_id = this._render_process_id = Math.random();
    //         // 自定义动画
    //         Polymer.RenderStatus.afterNextRender(this, () => {
    //             if (this._render_process_id != current_render_process_id) {
    //                 return
    //             }
    //             this.set("selectedPageName", this.selectedTabName);

    //             // 动态添加节点
    //             var $iron_pages = this.$.pages_container;
    //             var $selected_item = $iron_pages.selectedItem;
    //             if (!$selected_item) {
    //                 return
    //             }
    //             var contain_tag_name = "kb-app-" + page;
    //             if ($selected_item && !$selected_item.querySelector(contain_tag_name)) {
    //                 var page_node = document.createElement(contain_tag_name);
    //                 $selected_item.appendChild(page_node);
    //             }

    //             var $pre_selected_item = $iron_pages.items.filter((n) => {
    //                 n.classList.add("neon-animating");
    //                 return n.getAttribute("name") === old_page
    //             })[0] || $selected_item;

    //             // 显示动画
    //             var diff_offsetLeft = $pre_selected_item.offsetLeft - $selected_item.offsetLeft;
    //             var duration = Math.sqrt(Math.abs(diff_offsetLeft)) * 10;

    //             var _ani_queue_length = 0;
    //             $iron_pages.items.forEach((n) => {
    //                 n._current_ani && n._current_ani.cancel();
    //                 n._current_ani = n.animate([{
    //                     transform: "translateX(" + (-$pre_selected_item.offsetLeft) + "px) translateZ(0)"
    //                 }, {
    //                     transform: "translateX(" + (-$selected_item.offsetLeft) + "px) translateZ(0)"
    //                 }], {
    //                     duration: duration,
    //                     iterations: 1,
    //                     easing: "cubic-bezier(0.165, 0.840, 0.440, 1.000)",
    //                 });
    //                 _ani_queue_length += 1;
    //                 n._current_ani.onfinish = () => {
    //                     n.classList.remove("neon-animating");
    //                     n._current_ani = null;
    //                     _ani_queue_length -= 1;
    //                     if (!_ani_queue_length) {
    //                         // 所有动画完成，改变路由
    //                         this.set("routeData.page", page);
    //                     }
    //                 }
    //             });
    //         });

    //     }, this._showPage404.bind(this), true);

    // }

    _showPage404() {
        // iron-pages
        this.parentNode.selected = "view404";
    }
    // _showPage404() {
    //     // 回滚到当前的选择
    //     this.set("selectedTabName", this.routeData.page);
    //     this.viewPage = 'view404';
    //     // 关闭loading提示器
    //     this.updateStyles({
    //         "--app-show-paper-progress": "none"
    //     });
    // }
    constructor() {
        super("../");
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
        this.addEventListener("switch-page-success", e => {
            const { new_page, old_page } = e.detail;
            // 渲染进程ID
            var current_render_process_id = (this._render_process_id = Math.random());
            // 自定义动画
            Polymer.RenderStatus.afterNextRender(this, () => {
                if (this._render_process_id != current_render_process_id) {
                    return;
                }
                // this.set("selectedPageName", this.selectedTabName);

                // 动态添加节点
                var $iron_pages = this.$.pages_container;
                var $selected_item = $iron_pages.selectedItem;
                if (!$selected_item) {
                    return;
                }
                var contain_tag_name = "kb-app-" + new_page;
                if (
                    $selected_item &&
                    !$selected_item.querySelector(contain_tag_name)
                ) {
                    var page_node = document.createElement(contain_tag_name);
                    $selected_item.appendChild(page_node);
                }

                var $pre_selected_item =
                    $iron_pages.items.filter(n => {
                        n.classList.add("neon-animating");
                        return n.getAttribute("name") === old_page;
                    })[0] || $selected_item;

                // 显示动画
                var diff_offsetLeft =
                    $pre_selected_item.offsetLeft - $selected_item.offsetLeft;
                var duration = Math.sqrt(Math.abs(diff_offsetLeft)) * 10;

                var _ani_queue_length = 0;
                $iron_pages.items.forEach(n => {
                    n._current_ani && n._current_ani.cancel();
                    n._current_ani = n.animate(
                        [
                            {
                                transform: `translateX(${-$pre_selected_item.offsetLeft}px) translateZ(0)`
                            },
                            {
                                transform: `translateX(${-$selected_item.offsetLeft}px) translateZ(0)`
                            }
                        ],
                        {
                            duration: duration,
                            iterations: 1,
                            easing: "cubic-bezier(0.165, 0.840, 0.440, 1.000)"
                        }
                    );
                    _ani_queue_length += 1;
                    n._current_ani.onfinish = () => {
                        n.classList.remove("neon-animating");
                        n._current_ani = null;
                        _ani_queue_length -= 1;
                        if (!_ani_queue_length) {
                            // 所有动画完成，改变路由
                            this.set("route.path", "/" + new_page);
                        }
                    };
                });
            });
        });
    }
}
window.customElements.define(KbApp.is, KbApp);
