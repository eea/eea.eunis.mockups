
/* Merged Plone Javascript file
 * This file is dynamically assembled from separate parts.
 * Some of these parts have 3rd party licenses or copyright information attached
 * Such information is valid for that section,
 * not for the entire composite file
 * originating files are separated by - filename.js -
 */

/* - eea-accordion.js - */
// http://www.eea.europa.eu/portal_javascripts/eea-accordion.js?original=1
jQuery(document).ready(function($) {
    var portlet = jQuery('dl.portletNavigationTree');
    if (portlet.length) {
        var tabs = jQuery('dd.portletItem', portlet);
        var index = 0;
        tabs.each(function(idx, obj) {
            var here = jQuery(this);
            if (jQuery('.navTreeCurrentNode', here).length > 0) {
                index = idx;
                return false
            }
        });
        portlet.tabs("dl.portletNavigationTree dd.portletItem", {
            tabs: "dt.portletSubMenuHeader",
            effect: "slide",
            initialIndex: index
        });
        portlet.delegate('.current, .collapsed', 'click', function() {
            var tabs = portlet.data('tabs');
            if (index == tabs.getIndex()) {
                if (tabs.getCurrentTab().hasClass('current')) {
                    tabs.getCurrentPane().slideUp();
                    tabs.getCurrentTab().removeClass('current').addClass('collapsed')
                } else {
                    tabs.getCurrentPane().slideDown();
                    tabs.getCurrentTab().addClass('current').removeClass('collapsed')
                }
            }
            index = tabs.getIndex()
        })
    }
    var eea_accordion = function() {
        var $folder_panels = $('.eea-accordion-panels');
        if ($folder_panels.length) {
            $($folder_panels).tabs(".eea-accordion-panels div.pane", {
                tabs: '.eea-accordion-title, h2',
                effect: 'slide',
                initialIndex: 0
            })
        }
    };
    eea_accordion();
    window.EEA = window.EEA || {};
    window.EEA.eea_accordion = eea_accordion
});

/* - form_tabbing.js - */
// http://www.eea.europa.eu/portal_javascripts/form_tabbing.js?original=1
var ploneFormTabbing = {
    jqtConfig: {
        current: 'selected'
    }
};
(function($) {
    ploneFormTabbing._buildTabs = function(container, legends) {
        var legends_length = legends.length;
        var threshold = legends_length > 6;
        var panel_ids, tab_ids = [],
            tabs = '',
            i;
        for (i = 0; i < legends_length; i += 1) {
            var className, tab, legend = legends[i],
                lid = legend.id;
            tab_ids[i] = '#' + lid;
            switch (i) {
                case (0):
                    className = 'class="formTab firstFormTab"';
                    break;
                case (legends_length - 1):
                    className = 'class="formTab lastFormTab"';
                    break;
                default:
                    className = 'class="formTab"';
                    break
            }
            if (threshold) {
                tab = '<option ' + className + ' id="' + lid + '" value="' + lid + '">';
                tab += $(legend).text() + '</option>'
            } else {
                tab = '<li ' + className + '><a id="' + lid + '" href="#' + lid + '"><span>';
                tab += $(legend).text() + '</span></a></li>'
            }
            tabs += tab;
            $(legend).css({
                'visibility': 'hidden',
                'font-size': '0',
                'padding': '0',
                'height': '0',
                'width': '0',
                'line-height': '0'
            })
        }
        tab_ids = tab_ids.join(',');
        panel_ids = tab_ids.replace(/#fieldsetlegend-/g, "#fieldset-");
        if (threshold) {
            tabs = $('<select class="formTabs">' + tabs + '</select>');
            tabs.change(function() {
                var selected = $(this).attr('value');
                $(this).parent().find('option#' + selected).click()
            })
        } else {
            tabs = $('<ul class="formTabs">' + tabs + '</ul>')
        }
        return tabs
    };
    ploneFormTabbing.initializeDL = function() {
        var ftabs = $(ploneFormTabbing._buildTabs(this, $(this).children('dt')));
        var targets = $(this).children('dd');
        $(this).before(ftabs);
        targets.addClass('formPanel');
        ftabs.tabs(targets, ploneFormTabbing.jqtConfig)
    };
    ploneFormTabbing.initializeForm = function() {
        var jqForm = $(this);
        var fieldsets = jqForm.children('fieldset');
        if (!fieldsets.length) {
            return
        }
        var ftabs = ploneFormTabbing._buildTabs(this, fieldsets.children('legend'));
        $(this).prepend(ftabs);
        fieldsets.addClass("formPanel");
        $(this).find('input[name="fieldset"]').addClass('noUnloadProtection');
        $(this).find('.formPanel:has(div.field span.required)').each(function() {
            var id = this.id.replace(/^fieldset-/, "#fieldsetlegend-");
            $(id).addClass('required')
        });
        var initialIndex = 0;
        var count = 0;
        var found = false;
        $(this).find('.formPanel').each(function() {
            if (!found && $(this).find('div.field.error').length !== 0) {
                initialIndex = count;
                found = true
            }
            count += 1
        });
        var tabSelector = 'ul.formTabs';
        if ($(ftabs).is('select.formTabs')) {
            tabSelector = 'select.formTabs'
        }
        var tabsConfig = $.extend({}, ploneFormTabbing.jqtConfig, {
            'initialIndex': initialIndex
        });
        jqForm.children(tabSelector).tabs(jqForm.children('fieldset.formPanel'), tabsConfig);
        jqForm.submit(function() {
            var selected;
            if (ftabs.find('a.selected').length >= 1) {
                selected = ftabs.find('a.selected').attr('href').replace(/^#fieldsetlegend-/, "#fieldset-")
            } else {
                selected = ftabs.attr('value').replace(/^fieldsetlegend-/, '#fieldset-')
            }
            var fsInput = jqForm.find('input[name="fieldset"]');
            if (selected && fsInput) {
                fsInput.val(selected)
            }
        });
        $("#archetypes-schemata-links").addClass('hiddenStructure');
        $("div.formControls input[name='form.button.previous']," + "div.formControls input[name='form.button.next']").remove()
    };
    $.fn.ploneTabInit = function(pbo) {
        return this.each(function() {
            var item = $(this);
            item.find("form.enableFormTabbing,div.enableFormTabbing").each(ploneFormTabbing.initializeForm);
            item.find("dl.enableFormTabbing").each(ploneFormTabbing.initializeDL);
            var targetPane = item.find('.enableFormTabbing input[name="fieldset"]').val() || window.location.hash;
            if (targetPane) {
                item.find(".enableFormTabbing .formTabs " + targetPane.replace("'", "").replace(/^#fieldset-/, "#fieldsetlegend-")).click()
            }
        })
    };
    ploneFormTabbing.initialize = function() {
        $('body').ploneTabInit()
    }
})(jQuery);
jQuery(function() {
    ploneFormTabbing.initialize()
});

/* - jquery.highlightsearchterms.js - */
// http://www.eea.europa.eu/portal_javascripts/jquery.highlightsearchterms.js?original=1
(function($) {
    var Highlighter, makeSearchKey, makeAddress, defaults;
    Highlighter = function(options) {
        $.extend(this, options);
        this.terms = this.cleanTerms(this.terms.length ? this.terms : this.getSearchTerms())
    };
    Highlighter.prototype = {
        highlight: function(startnode) {
            if (!this.terms.length || !startnode.length) {
                return
            }
            var self = this;
            $.each(this.terms, function(i, term) {
                startnode.find('*:not(textarea)').andSelf().contents().each(function() {
                    if (this.nodeType === 3) {
                        self.highlightTermInNode(this, term)
                    }
                })
            })
        },
        highlightTermInNode: function(node, word) {
            var c = node.nodeValue,
                self = this,
                highlight, ci, index, next;
            if ($(node).parent().hasClass(self.highlightClass)) {
                return
            }
            highlight = function(content) {
                return $('<span class="' + self.highlightClass + '">dummy</span>').text(content)
            };
            ci = self.caseInsensitive;
            while (c && (index = (ci ? c.toLowerCase() : c).indexOf(word)) > -1) {
                $(node).before(document.createTextNode(c.substr(0, index))).before(highlight(c.substr(index, word.length))).before(document.createTextNode(c.substr(index + word.length)));
                next = node.previousSibling;
                $(node).remove();
                node = next;
                c = node.nodeValue
            }
        },
        queryStringValue: function(uri, regexp) {
            var match, pair;
            if (uri.indexOf('?') < 0) {
                return ''
            }
            uri = uri.substr(uri.indexOf('?') + 1);
            while (uri.indexOf('=') >= 0) {
                uri = uri.replace(/^\&*/, '');
                pair = uri.split('&', 1)[0];
                uri = uri.substr(pair.length);
                match = pair.match(regexp);
                if (match) {
                    return decodeURIComponent(match[match.length - 1].replace(/\+/g, ' '))
                }
            }
            return ''
        },
        termsFromReferrer: function() {
            var ref, i, se;
            ref = $.fn.highlightSearchTerms._test_referrer !== null ? $.fn.highlightSearchTerms._test_referrer : document.referrer;
            if (!ref) {
                return ''
            }
            for (i = 0; i < this.referrers.length; i += 1) {
                se = this.referrers[i];
                if (ref.match(se.address)) {
                    return this.queryStringValue(ref, se.key)
                }
            }
            return ''
        },
        cleanTerms: function(terms) {
            var self = this;
            return $.unique($.map(terms, function(term) {
                term = $.trim(self.caseInsensitive ? term.toLowerCase() : term);
                return (!term || self.filterTerms.test(term)) ? null : term
            }))
        },
        getSearchTerms: function() {
            var terms = [],
                uri = $.fn.highlightSearchTerms._test_location !== null ? $.fn.highlightSearchTerms._test_location : location.href;
            if (this.useReferrer) {
                $.merge(terms, this.termsFromReferrer().split(/\s+/))
            }
            if (this.useLocation) {
                $.merge(terms, this.queryStringValue(uri, this.searchKey).split(/\s+/))
            }
            return terms
        }
    };
    makeSearchKey = function(key) {
        return (typeof key === 'string') ? new RegExp('^' + key + '=(.*)$', 'i') : key
    };
    makeAddress = function(addr) {
        return (typeof addr === 'string') ? new RegExp('^https?://(www\\.)?' + addr, 'i') : addr
    };
    $.fn.highlightSearchTerms = function(options) {
        options = $.extend({}, defaults, options);
        options = $.extend(options, {
            searchKey: makeSearchKey(options.searchKey),
            referrers: $.map(options.referrers, function(se) {
                return {
                    address: makeAddress(se.address),
                    key: makeSearchKey(se.key)
                }
            })
        });
        if (options.includeOwnDomain) {
            var hostname = $.fn.highlightSearchTerms._test_location !== null ? $.fn.highlightSearchTerms._test_location : location.hostname;
            options.referrers.push({
                address: makeAddress(hostname.replace(/\./g, '\\.')),
                key: options.searchKey
            })
        }
        new Highlighter(options).highlight(this);
        return this
    };
    $.fn.highlightSearchTerms.referrers = [{
        address: 'google\\.',
        key: 'q'
    }, {
        address: 'search\\.yahoo\\.',
        key: 'p'
    }, {
        address: 'search\\.msn\\.',
        key: 'q'
    }, {
        address: 'search\\.live\\.',
        key: 'query'
    }, {
        address: 'search\\.aol\\.',
        key: 'userQuery'
    }, {
        address: 'ask\\.com',
        key: 'q'
    }, {
        address: 'altavista\\.',
        key: 'q'
    }, {
        address: 'feedster\\.',
        key: 'q'
    }];
    defaults = {
        terms: [],
        useLocation: true,
        searchKey: '(searchterm|SearchableText)',
        useReferrer: true,
        referrers: $.fn.highlightSearchTerms.referrers,
        includeOwnDomain: true,
        caseInsensitive: true,
        filterTerms: /(not|and|or)/i,
        highlightClass: 'highlightedSearchTerm'
    };
    $.fn.highlightSearchTerms._test_location = null;
    $.fn.highlightSearchTerms._test_referrer = null;
    $.fn.highlightSearchTerms._highlighter = Highlighter
}(jQuery));
jQuery(function($) {
    $('#region-content,#content').highlightSearchTerms({
        includeOwnDomain: $('dl.searchResults').length === 0
    })
});

/* - createversion.js - */
// http://www.eea.europa.eu/portal_javascripts/createversion.js?original=1
var latestVersionUrl = "";

function checkLatestVersion(repeat) {
    jQuery.ajax({
        url: context_url + "/getLatestVersionUrl",
        success: function(data) {
            if (data == latestVersionUrl) {
                if (repeat) {
                    setTimeout("checkLatestVersion(false)", 5000)
                }
            } else {
                jQuery.fancybox('<div style="text-align:center;width:250px;">' + '<span>The new version was created, you can see ' + 'it by clicking on the following link:</span><br/><br/>' + '<a href="' + data + '">' + data + '</a></div>', {
                    'modal': false
                })
            }
        }
    })
}

function startCreationOfNewVersion() {
    jQuery.ajax({
        url: context_url + "/getLatestVersionUrl",
        success: function(data) {
            latestVersionUrl = data;
            jQuery.fancybox('<div style="text-align:center;width:250px;"><span>' + 'Please wait, a new version is being created.</span><br/><br/><img ' + 'src="++resource++jqzoom/zoomloader.gif"/></div>', {
                'modal': true
            });
            jQuery.ajax({
                url: context_url + "/@@createVersionAjax",
                success: function(data) {
                    if (data.indexOf("SEEURL") === 0) {
                        var url = data.replace("SEEURL:", "");
                        window.location.href = url
                    } else {
                        checkLatestVersion(true)
                    }
                },
                error: function(xhr, ajaxOptions, thrownError) {
                    if (xhr.status == 504) {
                        checkLatestVersion(true)
                    } else {
                        jQuery.fancybox('<div style="text-align:center;width:250px;">' + '<span>An internal error occured, please contact the administrator' + '</span></div>', {
                            'modal': false
                        })
                    }
                }
            })
        }
    })
}
jQuery(document).ready(function($) {
    var $show_older_versions = $(".showOlderVersions"),
        $previous_versions = $("#previous-versions");
    $previous_versions.css('display', 'none');
    $show_older_versions.click(function(e) {
        $previous_versions.slideToggle();
        e.preventDefault()
    })
});

/* - ++resource++eea.dataservice.survey.js - */
// http://www.eea.europa.eu/portal_javascripts/++resource++eea.dataservice.survey.js?original=1
var DataService = {
    'version': '1.0.0'
};
DataService.Survey = {
    initialize: function(context) {
        this.context = context ? jQuery('#' + context) : jQuery('#region-content');
        this.links = jQuery('a.feedback-survey', this.context);
        this.selected = null;
        this.cookie = null;
        this.survey_next = {};
        if (!this.links.length) {
            return
        }
        var js_context = this;
        this.links.each(function() {
            var link = jQuery(this);
            js_context.survey_next[link.attr('id')] = link.attr('href');
            link.attr('href', '');
            var cookie_id = jQuery('span.google-analytics-path', link).text();
            cookie_id = cookie_id.split('/');
            cookie_id = cookie_id[cookie_id.length - 1];
            link.click(function(evt) {
                js_context.selected = link;
                js_context.cookie = cookie_id;
                return js_context.open_survey(this)
            })
        });
        this.init_survey()
    },
    init_survey: function() {
        var js_context = this;
        js_context.survey = jQuery('<div>');
        js_context.survey.attr('title', 'Usage feedback');
        jQuery.get('@@survey.html', {}, function(data) {
            js_context.survey.html(data);
            js_context.init_form();
            js_context.survey.dialog({
                modal: true,
                autoOpen: false,
                width: 800,
                buttons: js_context.buttons()
            })
        })
    },
    init_form: function() {
        var js_context = this;
        var sectors = jQuery('#sectors-widget', js_context.survey);
        var domains = jQuery('#domains-widget', js_context.survey);
        var environment = false;
        var domains_clicked = false;
        var form = jQuery('form', js_context.survey);
        form.submit(function() {
            return false
        });
        jQuery('input#environment', sectors).click(function() {
            var input = jQuery(this);
            var label = jQuery('label', input.parent());
            if (input.attr('checked')) {
                environment = true;
                domains.show();
                label.css('font-weight', 'bold')
            } else {
                environment = false;
                domains.hide();
                label.css('font-weight', 'normal');
                jQuery('input', domains).attr('checked', false);
                domains_clicked = false
            }
        });
        jQuery('input', sectors).click(function() {
            var checked = jQuery('input:checked', sectors);
            if (checked.length) {
                if (environment && !domains_clicked) {
                    js_context.survey.dialog('option', 'buttons', js_context.buttons(false))
                } else {
                    js_context.survey.dialog('option', 'buttons', js_context.buttons(true, form))
                }
            } else {
                js_context.survey.dialog('option', 'buttons', js_context.buttons(false))
            }
        });
        jQuery('input', domains).click(function() {
            var checked = jQuery('input:checked', domains);
            if (checked.length) {
                domains_clicked = true;
                js_context.survey.dialog('option', 'buttons', js_context.buttons(true, form))
            } else {
                domains_clicked = false;
                js_context.survey.dialog('option', 'buttons', js_context.buttons(false))
            }
        })
    },
    buttons: function(download, form) {
        var js_context = this;
        var res = {};
        if (download) {
            res['Download data'] = function() {
                js_context.download(form.serialize());
                jQuery(this).dialog('close')
            }
        }
        res.Cancel = function() {
            jQuery(this).dialog('close')
        };
        res.Skip = function() {
            js_context.download('skipped=1');
            jQuery(this).dialog('close')
        };
        return res
    },
    open_survey: function(link) {
        link = jQuery(link);
        var cookie = jQuery.cookie(this.cookie);
        if (!cookie) {
            this.survey.dialog('open');
            return false
        } else {
            return this.download(cookie)
        }
    },
    download: function(query) {
        if (!jQuery.cookie(this.cookie)) {
            if (query != 'skipped=1') {
                jQuery.cookie(this.cookie, query, {
                    expires: 1,
                    path: '/'
                })
            }
        }
        var next_id = this.selected.attr('id');
        var next = this.survey_next[next_id];
        return DataService.Google.track(this.selected, query, next)
    }
};
DataService.Google = {
    initialize: function(context) {
        this.context = context ? jQuery('#' + context) : jQuery('#region-content');
        this.links = jQuery('a.google-analytics', this.context);
        if (!this.links.length) {
            return
        }
        var js_context = this;
        this.links.each(function() {
            var link = jQuery(this);
            if (!link.hasClass('feedback-survey')) {
                link.click(function() {
                    return js_context.track(this, '', link.attr('href'))
                })
            }
        })
    },
    track: function(link, query, next) {
        link = jQuery(link);
        var path = jQuery('span.google-analytics-path', link);
        path = path.text();
        if (query) {
            path = path + '?' + query
        }
        if (window.pageTracker) {
            pageTracker._trackPageview(path)
        }
        window.location = next;
        return false
    }
};
DataService.Load = function() {
    DataService.Survey.initialize();
    DataService.Google.initialize()
};

/* - dataset_view.js - */
// http://www.eea.europa.eu/portal_javascripts/dataset_view.js?original=1
function showDefinition(context) {
    if (jQuery(context).html() === '[+]') {
        jQuery(context).parent().next().slideDown();
        jQuery(context).html('[x]')
    } else {
        jQuery(context).parent().next().slideUp();
        jQuery(context).html('[+]')
    }
}

function setTableDefShow() {
    jQuery('.table-definition-show').click(function() {
        showDefinition(this)
    })
}
jQuery(document).ready(function() {
    setTableDefShow();
    if (window.DataService) {
        window.DataService.Load()
    }
});

/* - whatsnew_gallery.js - */
// http://www.eea.europa.eu/portal_javascripts/whatsnew_gallery.js?original=1
jQuery(document).ready(function($) {
    $("#highlights-high, #highlights-middle").tabs("div.highlightMiddle", {
        tabs: 'div.panel',
        effect: 'slide'
    });
    window.whatsnew = {};
    var eea_gal = window.whatsnew;
    (function() {
        eea_gal.site_address = $("link[rel='alternate']").attr('href');
        eea_gal.gallery = $("#whatsnew-gallery");
        eea_gal.gallery_page = eea_gal.gallery.attr("data-page")
    }());
    eea_gal.whatsnew_func = function(cur_tab_val, sel_text, sel_value, index, tag_title) {
        var address = eea_gal.site_address + cur_tab_val + "_gallery_macro";
        var gal = eea_gal.gallery.find(".eea-tabs-panel");
        var news = index ? gal[index] : gal.filter(function() {
            return this.style.display !== 'none'
        });
        news = index === 0 ? gal.first() : news;
        news = news[0] !== undefined ? news[0] : news;
        var filter_topic;
        filter_topic = news.firstElementChild !== undefined ? news.firstElementChild : news.firstChild;
        var filter_topic_text = "Filtered by <span>" + sel_text + "</span> topic";
        filter_topic.innerHTML = sel_value ? filter_topic_text : "";
        var gallery_ajax = $(".gallery-ajax", news);
        var layout_selection = $('.gallery-layout-selection li a', news)[0];
        var params = sel_value ? 'topic' + '=' + sel_value : undefined;
        params = tag_title ? 'tags' + '=' + sel_value : params;
        gallery_ajax.load(address, params, function(html) {
            var album = gallery_ajax.find('.gallery-album');
            var listing = gallery_ajax.find('.gallery-listing');
            if (html.length > 1) {
                if (layout_selection.className === "list-layout active-list") {
                    gallery_ajax.find('.gallery-album').addClass('hiddenStructure');
                    listing.hide().fadeIn('slow')
                } else {
                    gallery_ajax.find('.gallery-listing').addClass('hiddenStructure');
                    album.hide().fadeIn('slow')
                }
            }
        })
    };
    $("#whatsnew-gallery .eea-tabs, #multimedia-tabs").tabs("> .eea-tabs-panel", function(event, index) {
        var cur_tab = this.getTabs()[index],
            cur_tab_val = cur_tab.id.substr(4);
        cur_tab.theme = cur_tab.theme || "none";
        var opt_item, sel_value, sel_text, tag_title;
        var highlight = $("#" + cur_tab_val + "-highlights");
        var gallery_ajax = highlight.find('.gallery-ajax');
        var ajax_loader_img = '<div style="text-align: center;"><img src="++resource++faceted_images/ajax-loader.gif" /></div>';
        var tag_cloud = $("#bottomright-widgets").find('#tag-cloud-content');
        if (cur_tab_val.indexOf('green') === -1 || cur_tab_val.indexOf('video') === -1) {
            tag_cloud.find("#c1_widget").fadeOut().empty().end().find('#c3_widget').empty().fadeOut()
        }
        if (tag_cloud.length) {
            var first_tag = tag_cloud.clone().detach();
            var address, topic_params, tags_params;
            var tabs = function(address, topic_params, tags_params) {
                address = address || eea_gal.site_address + 'all/@@tagscloud_counter';
                topic_params = topic_params || "cid=c1&c2=Products.EEAContentTypes.content.interfaces.IFlashAnimation&c3=all&c8=Animation+(swf)&c4=published&b_start=0";
                tags_params = tags_params || "cid=c3&c2=Products.EEAContentTypes.content.interfaces.IFlashAnimation&c3=all&c8=Animation+(swf)&c4=published&b_start=0";
                tag_cloud.load(address, topic_params, function(html) {
                    tag_cloud.find("#c1_widget").fadeIn();
                    var themes = $("#c1");
                    themes.tagcloud({
                        type: 'list',
                        height: 280,
                        sizemin: 12
                    });
                    var themes_li = themes.find('li');
                    var theme_vals;
                    theme_vals = themes_li.filter(function() {
                        return this.value === 1
                    });
                    theme_vals.remove();
                    $.get(address, tags_params, function(data) {
                        tag_cloud.append(data);
                        $("#c3_widget").fadeIn();
                        var tags = $("#c3");
                        tags.tagcloud({
                            type: 'list',
                            height: 280,
                            sizemin: 12
                        });
                        var vals = tags.find('li').filter(function() {
                            return this.value === 1
                        });
                        vals.remove();
                        $("#faceted-tabs").tabs("#tag-cloud-content > div.faceted-widget");
                        $('#c1all').addClass('selected');
                        $('#c3all').addClass('selected')
                    })
                })
            };
            switch (cur_tab_val) {
                case "greentips":
                    address = eea_gal.site_address + 'all/@@tagscloud_counter';
                    topic_params = "cid=c1&c2=Products.EEAContentTypes.content.interfaces.IFlashAnimation&c3=all&c8=Animation+(swf)&c4=published&b_start=0";
                    tags_params = "cid=c3&c2=Products.EEAContentTypes.content.interfaces.IFlashAnimation&c3=all&c8=Animation+(swf)&c4=published&b_start=0";
                    gallery_ajax.html(ajax_loader_img);
                    tabs(address, topic_params, tags_params);
                    break;
                case "videoclips":
                    address = eea_gal.site_address + 'all/@@tagscloud_counter';
                    topic_params = "cid=c1&c2=eea.mediacentre.interfaces.IVideo&c3=all&c8=&c4=published&b_start=0";
                    tags_params = "cid=c3&c2=eea.mediacentre.interfaces.IVideo&c3=all&c8=&c4=published&b_start=0";
                    gallery_ajax.html(ajax_loader_img);
                    tabs(address, topic_params, tags_params);
                    break
            }
        }
        opt_item = $("#topic-selector").find(":selected");
        if (opt_item.length) {
            sel_value = opt_item.val();
            sel_text = opt_item.text()
        } else {
            opt_item = $("#topright-widgets").find('.selected').filter(':visible');
            if (opt_item.length !== 0) {
                var tags = opt_item.parent().prev().text().indexOf('tags');
                sel_value = tags !== -1 ? opt_item[0].title : opt_item[0].id.substr(3);
                tag_title = tags !== -1 ? opt_item[0].title : undefined
            }
            sel_text = opt_item.text();
            sel_value = sel_value !== 'all' ? sel_value : ''
        }
        var album = highlight.find('.gallery-album');
        var album_length = album.length !== 0 ? album.children().length : 0;
        var notopics = highlight.find('.portalMessage'),
            notopics_length = notopics.length !== 0 ? 1 : 0;
        if (cur_tab.theme === sel_value && notopics_length !== 0) {
            return
        }
        if (sel_text.indexOf("All") !== -1 || album_length === 0) {
            album.html(ajax_loader_img);
            eea_gal.whatsnew_func(cur_tab_val, sel_text, sel_value, index, tag_title)
        }
        if (sel_value) {
            if (cur_tab.theme !== sel_value) {
                album.html(ajax_loader_img);
                cur_tab.theme = sel_value;
                eea_gal.whatsnew_func(cur_tab_val, sel_text, sel_value, index, tag_title)
            }
        }
    });
    $topic_selector = $("#topic-selector");
    $topic_selector.find('[value="default"]').remove();
    $topic_selector.change(

    function displayResult() {
        $topic_selector[0][0].className = "hiddenStructure";
        var x = this.selectedIndex,
            y = this.options;
        var topic_value = y[x].value,
            topic_text = y[x].innerHTML;
        var tab_val = $("#whatsnew-gallery .eea-tabs a.current, #multimedia-tabs a.current")[0].id.substr(4);
        eea_gal.whatsnew_func(cur_tab_val = tab_val, sel_text = topic_text, sel_value = topic_value)
    });
    var layout_links = $(".gallery-layout-selection li a");
    layout_links.click(function(e) {
        var $this = $(this);
        var $parent = $this.parent();
        var $ajax = $this.closest('ul').next();
        var $hidden_gallery = $ajax.find(".hiddenStructure");
        var listing = $ajax.find('.gallery-listing');
        var album = $ajax.find('.gallery-album');
        var next = $parent.siblings().find('a');
        var link_class = $this[0].className;
        var highlight = $this.closest('div')[0].id;
        if (link_class === "list-layout active-list" || link_class === "album-layout active-album") {
            return false
        }
        var cookie_expires = new Date();
        cookie_expires.setMonth(cookie_expires.getMonth() + 1);
        if (link_class == "list-layout") {
            album.slideUp('slow');
            listing.slideDown('slow');
            $hidden_gallery.removeClass("hiddenStructure");
            $this.toggleClass("active-list");
            next.toggleClass("active-album");
            SubCookieUtil.set(eea_gal.gallery_page, highlight, "active-list", expires = cookie_expires);
            return false
        } else {
            listing.slideUp('slow');
            album.slideDown('slow');
            $hidden_gallery.removeClass("hiddenStructure");
            $this.toggleClass("active-album");
            next.toggleClass("active-list");
            SubCookieUtil.set(eea_gal.gallery_page, highlight, "active-album", expires = cookie_expires);
            return false
        }
    });
    if (eea_gal.gallery.length > 0) {
        var gallery_cookies = SubCookieUtil.getAll(eea_gal.gallery_page);
        if (gallery_cookies !== null) {
            eea_gal.gallery.find('.eea-tabs-panel').each(function() {
                var $this = $(this);
                var layouts = $this.find(".gallery-layout-selection li a");
                var $hidden_gallery = $this.find(".hiddenStructure");
                var link_listing = layouts.first();
                var link_album = layouts.last();
                var listing = $this.find('.gallery-listing');
                var album = $this.find('.gallery-album');
                var gallery_cookie = gallery_cookies[this.id];
                if (gallery_cookie !== null) {
                    if (gallery_cookie === "active-album") {
                        listing.hide();
                        album.show();
                        $hidden_gallery.removeClass("hiddenStructure");
                        link_listing.removeClass("active-list");
                        link_album.addClass("active-album")
                    } else if (gallery_cookie === "active-list") {
                        listing.show();
                        album.hide();
                        $hidden_gallery.removeClass("hiddenStructure");
                        link_listing.addClass("active-list");
                        link_album.removeClass("active-album")
                    }
                }
            })
        }
    }
});

/* - print_warning.js - */
// http://www.eea.europa.eu/portal_javascripts/print_warning.js?original=1
var warning_displayed = false;
window.onbeforeprint = function() {
    var warning_text = jQuery.trim(jQuery("#print-warning p").html());
    if (warning_displayed === false) {
        alert(warning_text)
    }
};
jQuery(document).ready(function($) {
    $('#icon-print').parent().attr('href', '#').click(function() {
        var warning_text = $.trim($("#print-warning p").html());
        if (confirm(warning_text)) {
            warning_displayed = true;
            window.print()
        }
    })
});

/* - eea.geotags.js - */
/*global window, jQuery, google, dojo, esri, dijit*/

(function() {

    jQuery.geoevents = {
        select_point: 'geo-event-select-point',
        select_marker: 'geo-event-select-marker',
        map_loaded: 'geo-events-map-loaded',
        basket_delete: 'geo-events-basket-delete',
        basket_save: 'geo-events-basket-save',
        ajax_start: 'geo-events-ajax-start',
        ajax_stop: 'geo-events-ajax-stop'
    };

    // Convert google geocoder to geojson
    jQuery.google2geojson = function(googlejson) {
        var feature = {
            type: 'Feature',
            bbox: [],
            geometry: {
                type: 'Point',
                coordinates: []
            },
            properties: {
                name: '',
                title: '',
                description: '',
                tags: '',
                center: [],
                other: googlejson
            }
        };
        feature.properties.title = googlejson.address_components[0].long_name;
        feature.properties.description = googlejson.formatted_address;
        feature.properties.tags = googlejson.types;

        // Geometry
        feature.properties.center = [
        googlejson.geometry.location.lat(),
        googlejson.geometry.location.lng()];

        var bounds = googlejson.geometry.bounds;
        var type = 'Point';
        if (bounds) {
            type = 'Polygon';
        } else {
            bounds = googlejson.geometry.viewport;
        }
        feature.geometry.type = type;

        var ne = bounds.getNorthEast();
        var sw = bounds.getSouthWest();
        if (type === 'Polygon') {
            feature.geometry.coordinates = [
                [sw.lat(), sw.lng()],
                [sw.lat(), ne.lng()],
                [ne.lat(), ne.lng()],
                [ne.lat(), sw.lng()]
            ];
        } else {
            feature.geometry.type = 'Point';
            feature.geometry.coordinates = [
            googlejson.geometry.location.lat(),
            googlejson.geometry.location.lng()];
        }

        feature.bbox = [sw.lat(), sw.lng(), ne.lat(), ne.lng()];
        return feature;
    };

    /* Geolocator dialog jQuery plugin */
    jQuery.fn.geodialog = function(settings) {
        var self = this;
        self.initialized = false;
        self.events = {
            initialize: 'geo-dialog-initialize',
            save: 'geo-dialog-save'
        };

        self.options = {
            template: '',
            width: jQuery(window).width() * 0.85,
            height: jQuery(window).height() * 0.95,

            sidebar: {
                json: '',
                template: '',
                suggestions: '',
                fieldName: self.attr('id'),
                tabs: {
                    search: {},
                    advanced: {}
                }
            },

            map: {
                json: '',
                fieldName: self.attr('id')
            },

            basket: {
                json: '',
                template: '',
                fieldName: self.attr('id'),
                geojson: {
                    type: 'FeatureCollection',
                    features: []
                }
            },

            // Handlers
            handle_leftbutton_dblclick: function(button, area) {
                var width = self.leftarea.width();
                var max_width = 300;
                var min_width = 0;
                if (width < 20) {
                    area.trigger('resize', [max_width]);
                    jQuery('a', self.leftbutton).html('«');
                } else {
                    area.trigger('resize', [min_width]);
                    jQuery('a', self.leftbutton).html('»');
                }
            },

            handle_rightbutton_dblclick: function(button, area) {
                var width = self.rightarea.width();
                var min_width = area.width();
                var max_width = parseInt(3 * area.width() / 4, 10);

                if (width < 20) {
                    area.trigger('resize', [max_width]);
                    jQuery('a', self.rightbutton).html('»');
                } else {
                    area.trigger('resize', [min_width]);
                    jQuery('a', self.rightbutton).html('«');
                }
            },

            handle_initialize: function(data) {
                if (self.initialized) {
                    // Already initialized
                    return;
                }

                // Splitter
                jQuery.get(self.options.template, function(data) {
                    data = jQuery(data);
                    self.empty();
                    self.append(data);

                    // Left splitter
                    var left = jQuery('.geo-leftside', self);
                    left.splitter({
                        type: 'v',
                        outline: true,
                        accessKey: "L"
                    });

                    self.leftarea = jQuery('.geo-left', left);
                    self.leftbutton = jQuery('.vsplitbar', left);
                    jQuery('a', self.leftbutton).html('»');

                    jQuery('a', self.leftbutton).click(function() {
                        self.options.handle_leftbutton_dblclick(self.leftbutton, left);
                    });

                    self.leftbutton.dblclick(function() {
                        self.options.handle_leftbutton_dblclick(self.leftbutton, left);
                    });

                    // Right splitter
                    var right = jQuery('.geo-splitter', self);
                    right.splitter({
                        type: 'v',
                        outline: true,
                        sizeRight: 0,
                        accessKey: "R"
                    });

                    self.rightarea = jQuery('.geo-right', right);
                    self.rightbutton = jQuery(jQuery('.vsplitbar', right)[1]);
                    jQuery('a', self.rightbutton).html('«');

                    jQuery('a', self.rightbutton).click(function() {
                        self.options.handle_rightbutton_dblclick(self.rightbutton, right);
                    });

                    self.rightbutton.dblclick(function() {
                        self.options.handle_rightbutton_dblclick(self.rightbutton, right);
                    });

                    // Sidebar
                    self.sidebar = jQuery('.geo-sidebar', self);
                    self.sidebar.geosidebar(self.options.sidebar);

                    // Map
                    self.mapcanvas = jQuery('.geo-map', self);
                    self.mapcanvas.geomap(self.options.map);

                    // Basket
                    self.basket = jQuery('.geo-basket', self);
                    self.basket.geobasket(self.options.basket);
                });

                // Plugin initialized
                self.initialized = true;
            },

            handle_map_loaded: function(data) {
                jQuery('a', self.leftbutton).click();
                jQuery('a', self.rightbutton).click();
            },

            handle_save: function(data) {
                var fieldName = self.attr('id');
                var json = self.basket.options.geojson;
                // sort the geotags by name before sending it to object
                // annotation
                json.features = json.features.sort(function(a, b) {
                    var aName = a.properties.title.toLowerCase();
                    var bName = b.properties.title.toLowerCase();
                    return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
                });

                self.trigger(jQuery.geoevents.basket_save, {
                    json: json
                });
                json = JSON.stringify(json);
                jQuery('[name=' + fieldName + ']').text(json);
            },

            initialize: function() {
                self.dialog({
                    bgiframe: true,
                    modal: true,
                    closeOnEscape: false,
                    autoOpen: false,
                    width: self.options.width,
                    height: self.options.height,
                    resize: false,
                    dialogClass: 'eea-geotags-popup',
                    buttons: {
                        'Done': function() {
                            self.trigger(self.events.save);
                            self.dialog('close');
                        },
                        'Cancel': function() {
                            self.dialog('close');
                        }
                    },
                    close: function() {},
                    open: function() {
                        self.trigger(self.events.initialize);
                    }
                });

                // Bind events
                self.bind(self.events.initialize, function(evt, data) {
                    self.options.handle_initialize(data);
                });

                self.bind(self.events.save, function(evt, data) {
                    self.options.handle_save(data);
                });

                jQuery(self).bind(jQuery.geoevents.map_loaded, function(data) {
                    self.options.handle_map_loaded(data);
                });
            }
        };

        // Update settings
        if (settings) {
            jQuery.extend(self.options, settings);
        }

        self.options.initialize();
        return this;
    };

    /* Geo Map Canvas jQuery plugin */
    jQuery.fn.geomap = function(settings) {
        var self = this;

        self.options = {
            json: '',
            fieldName: '',
            map_options: {
                latitude: 55,
                longitude: 35,
                center: null,
                zoom: 4,
                navigationControl: true,
                navigationControlOptions: {
                    style: google.maps.NavigationControlStyle.ZOOM_PAN,
                    position: google.maps.ControlPosition.RIGHT
                },
                mapTypeControl: true,
                mapTypeControlOptions: {
                    position: google.maps.ControlPosition.TOP_RIGHT,
                    style: google.maps.MapTypeControlStyle.DEFAULT
                },
                mapTypeId: google.maps.MapTypeId.TERRAIN
            },

            // Handlers
            handle_select: function(data, autoclick) {
                if (!data) {
                    return;
                }

                if (data.bbox.length) {
                    var lat = data.bbox[0];
                    var lng = data.bbox[1];
                    var sw = new google.maps.LatLng(lat, lng);

                    lat = data.bbox[2];
                    lng = data.bbox[3];
                    var ne = new google.maps.LatLng(lat, lng);

                    var viewport = new google.maps.LatLngBounds(sw, ne);
                    self.Map.fitBounds(viewport);
                } else {
                    self.Map.setZoom(4);
                }

                // Marker
                jQuery.geomarker({
                    fieldName: self.options.fieldName,
                    map: self.Map,
                    points: [data],
                    center: data.properties.center,
                    autoclick: autoclick
                });
            },

            handle_rightclick: function(data, center) {
                // Markers
                jQuery.geomarker({
                    fieldName: self.options.fieldName,
                    map: self.Map,
                    points: data.features,
                    center: center
                });
            },

            initialize: function() {
                self.initialized = false;
                self.addClass('geo-mapcanvas');
                var options = self.options.map_options;
                if (!options.latlng) {
                    options.center = new google.maps.LatLng(
                    options.latitude,
                    options.longitude);
                }

                self.Map = new google.maps.Map(self[0], options);
                self.Geocoder = new google.maps.Geocoder();

                // Handle events
                var context = jQuery('#' + self.options.fieldName);
                jQuery(context).bind(jQuery.geoevents.select_point, function(evt, data) {
                    data.target.effect('transfer', {
                        to: self
                    }, 'slow', function() {
                        self.options.handle_select(data.point, data.autoclick);
                    });
                });

                // Map initialized
                google.maps.event.addListener(self.Map, 'tilesloaded', function() {
                    if (self.initialized) {
                        return;
                    }
                    self.initialized = true;
                    jQuery(context).trigger(jQuery.geoevents.map_loaded);
                });

                // Right click
                google.maps.event.addListener(self.Map, 'rightclick', function(data) {
                    var latlng = data.latLng;
                    var center = [latlng.lat(), latlng.lng()];

                    // Empty marker to clear map
                    jQuery.geomarker({
                        fieldName: self.options.fieldName,
                        map: self.Map,
                        center: center,
                        points: []
                    });

                    jQuery(context).trigger(jQuery.geoevents.ajax_start);
                    self.Geocoder.geocode({
                        location: latlng
                    }, function(results) {
                        var features = [];
                        jQuery.each(results, function() {
                            features.push(jQuery.google2geojson(this));
                        });

                        results = {
                            type: 'FeatureCollection',
                            features: features
                        };

                        self.options.handle_rightclick(results, center);
                        jQuery(context).trigger(jQuery.geoevents.ajax_stop);
                    });
                });
            }
        };

        if (settings) {
            jQuery.extend(self.options, settings);
        }

        // Return
        self.options.initialize();
        return this;
    };

    jQuery.geomarker = function(settings) {
        var self = this;

        self.options = {
            fieldName: '',
            template: '<div class="geo-marker">' + '<h3 class="title"></h3>' + '<h4 class="subtitle"></h4>' + '<h5 class="tags"></h5>' + '</div>',
            map: null,
            points: [],
            center: [0, 0],
            autoclick: false,

            initialize: function() {
                self.options.clear();
                self.mappoints = {};

                // Marker
                var center = self.options.center;
                var latlng = new google.maps.LatLng(center[0], center[1]);
                self.marker = new google.maps.Marker({
                    position: latlng
                });
                self.marker.setMap(self.options.map);

                // InfoWindow
                var template = jQuery('<div>');
                jQuery.each(self.options.points, function() {
                    var point = this;
                    var uid = point.properties.center[0] + '-' + point.properties.center[1];
                    self.mappoints[uid] = point;

                    var title = this.properties.title;
                    var subtitle = this.properties.description;
                    var tags = '';
                    if (typeof(this.properties.tags) === 'string') {
                        tags = this.properties.tags;
                    } else {
                        jQuery.each(this.properties.tags, function() {
                            tags += this + ', ';
                        });
                    }

                    var itemplate = jQuery(self.options.template);
                    itemplate.attr('id', uid).attr('title', 'Add');
                    var icon = jQuery('<div>')
                        .addClass('ui-icon')
                        .addClass('ui-icon-extlink')
                        .text('+');
                    itemplate.prepend(icon);
                    jQuery('.title', itemplate).text(title);
                    jQuery('.subtitle', itemplate).text(subtitle);
                    jQuery('.tags', itemplate).text(tags);

                    template.append(itemplate);
                });

                var context = jQuery('#' + self.options.fieldName);
                if (self.options.points.length) {
                    // Add info window
                    self.info = new google.maps.InfoWindow({
                        content: template.html()
                    });

                    self.info.open(self.options.map, self.marker);
                    google.maps.event.addListener(self.info, 'domready', function() {
                        jQuery('.geo-marker').click(function() {
                            var _self = jQuery(this);
                            jQuery(context).trigger(jQuery.geoevents.select_marker, {
                                point: self.mappoints[_self.attr('id')],
                                button: _self
                            });
                        });

                        // Autoclick
                        if (self.options.autoclick) {
                            jQuery('.geo-marker').click();
                        }
                    });

                    // Google event handlers
                    google.maps.event.addListener(self.marker, 'click', function() {
                        self.info.open(self.options.map, self.marker);
                    });
                }
            },

            clear: function() {
                if (self.marker) {
                    self.marker.setMap(null);
                }
                if (self.info) {
                    self.info.close();
                }
            }
        };

        if (settings) {
            jQuery.extend(self.options, settings);
        }

        self.options.initialize();
        return this;
    };

    /* Geo basket jQuery plugin */
    jQuery.fn.geobasket = function(settings) {
        var self = this;

        self.options = {
            json: '',
            template: '',
            fieldName: '',
            multiline: 1,
            geojson: {
                type: 'FeatureCollection',
                features: []
            },

            initialize: function() {
                var query = {};
                query.fieldName = self.options.fieldName;
                jQuery.get(self.options.template, query, function(data) {
                    self.html(data);
                    self.options.redraw(false);
                });

                var context = jQuery('#' + self.options.fieldName);
                jQuery(context).bind(jQuery.geoevents.select_marker, function(evt, data) {
                    data.button.effect('transfer', {
                        to: self
                    }, 'slow', function() {
                        self.options.handle_select(data.point);
                    });
                });

                jQuery(context).bind(jQuery.geoevents.basket_delete, function(evt, data) {
                    data.element.slideUp(function() {
                        jQuery(this).remove();
                        self.options.handle_delete(data.point);
                    });
                });
            },

            handle_delete: function(point) {
                var pcenter = point.properties.center;
                pcenter = pcenter[0] + '-' + pcenter[1];
                self.options.geojson.features = jQuery.map(self.options.geojson.features,

                function(feature, index) {
                    var center = feature.properties.center;
                    center = center[0] + '-' + center[1];
                    if (pcenter !== center) {
                        return feature;
                    }
                });
            },

            handle_select: function(point) {
                var i, initialData = window.EEAGeotags.initialCountryData,
                    initialData_length, names, features_length;
                if (!self.options.multiline) {
                    self.options.geojson.features = [];
                } else {
                    self.options.handle_delete(point);
                }

                if (initialData) {
                    names = [];
                    // add also the individual countries that are part of this country group
                    initialData_length = initialData.features.length;
                    features_length = self.options.geojson.features.length;
                    for (i = 0; i < features_length; i += 1) {
                        names.push(self.options.geojson.features[i].properties.name);
                    }
                    for (i = 0; i < initialData_length; i += 1) {
                        // add only the countries that are not already in the list by checking
                        // their geotags name
                        if (jQuery.inArray(initialData.features[i].properties.name, names) === -1) {
                            self.options.geojson.features.unshift(initialData.features[i]);
                        }
                    }
                } else {
                    self.options.geojson.features.unshift(point);
                }
                self.options.redraw(true);
            },

            redraw: function(highlight) {
                var items = jQuery('.geo-basket-items', self);
                items.empty();

                jQuery.each(self.options.geojson.features, function() {
                    var div = jQuery('<div>');
                    items.append(div);
                    div.geobasketitem({
                        fieldName: self.options.fieldName,
                        point: this
                    });
                });
                if (highlight) {
                    var first = jQuery('.geo-point-view:first', items);
                    first.addClass('ui-pulsate-item');
                    first.effect('pulsate', {}, 200, function() {
                        first.removeClass('ui-pulsate-item');
                    });
                }
            }
        };

        if (settings) {
            jQuery.extend(self.options, settings);
        }

        // Return
        self.options.initialize();
        return this;
    };

    /* Geo basket item */
    jQuery.fn.geobasketitem = function(settings) {
        var self = this;
        self.options = {
            fieldName: '',
            template: '<div>' + '<h3 class="title"></h3>' + '<h4 class="subtitle"></h4>' + '<h5 class="tags"></h5>' + '</div>',
            point: {},

            // Methods
            initialize: function() {
                self.addClass('geo-point-view');
                self.delbutton = jQuery('<div>')
                    .addClass('ui-icon')
                    .addClass(' ui-icon-trash')
                    .text('X')
                    .attr('title', 'Delete');
                self.prepend(self.delbutton);

                var context = jQuery('#' + self.options.fieldName);
                self.delbutton.click(function() {
                    jQuery(context).trigger(jQuery.geoevents.basket_delete, {
                        point: self.options.point,
                        element: self
                    });
                });

                var title = self.options.point.properties.title;
                var subtitle = self.options.point.properties.description;
                var tags = '';
                if (typeof(self.options.point.properties.tags) === 'string') {
                    tags = self.options.point.properties.tags;
                } else {
                    jQuery.each(self.options.point.properties.tags, function() {
                        tags += this + ', ';
                    });
                }

                var template = jQuery(self.options.template);
                jQuery('.title', template).text(title);
                jQuery('.subtitle', template).text(subtitle);
                jQuery('.tags', template).text(tags);

                self.append(template);
            }
        };

        if (settings) {
            jQuery.extend(self.options, settings);
        }

        self.options.initialize();
        return this;
    };

    /* Geo Side bar jQuery plugin */
    jQuery.fn.geosidebar = function(settings) {
        var self = this;
        self.options = {
            json: '',
            template: '',
            suggestions: '',
            fieldName: '',
            tabs: {
                search: {},
                advanced: {}
            },

            // Methods
            initialize: function() {
                var query = {};
                query.fieldName = self.options.fieldName;
                jQuery.get(self.options.template, query, function(data) {
                    self.sidebararea = jQuery(data);

                    self.loading = jQuery('<div>');
                    self.sidebararea.append(self.loading);
                    self.loading.geoloader({
                        fieldName: self.options.fieldName
                    });

                    self.append(self.sidebararea);

                    var options = self.options.tabs;
                    options.json = self.options.json;
                    options.fieldName = self.options.fieldName;
                    options.suggestions = self.options.suggestions;
                    self.sidebararea.geotabs(options);
                });
            }

        };

        if (settings) {
            jQuery.extend(self.options, settings);
        }

        self.options.initialize();
        return this;
    };

    jQuery.fn.geoloader = function(settings) {
        var self = this;
        self.working = 0;

        self.options = {
            fieldName: '',

            initialize: function() {
                self.addClass('geo-loading');
                self.hide();

                var context = jQuery('#' + self.options.fieldName);
                self.ajaxStart(function() {
                    jQuery(context).trigger(jQuery.geoevents.ajax_start);
                });

                self.ajaxStop(function() {
                    jQuery(context).trigger(jQuery.geoevents.ajax_stop);

                });

                jQuery(context).bind(jQuery.geoevents.ajax_start, function() {
                    self.show();
                });

                jQuery(context).bind(jQuery.geoevents.ajax_stop, function() {
                    self.hide();
                });
            },

            show: function() {
                self.working += 1;
                if (self.working > 0) {
                    self.show();
                }
            },

            hide: function() {
                self.working -= 1;
                if (!self.working) {
                    self.hide();
                }
            }
        };


        if (settings) {
            jQuery.extend(self.options, settings);
        }

        self.options.initialize();
        return this;
    };

    /* Geo tabs jQuery plugin */
    jQuery.fn.geotabs = function(settings) {
        var self = this;

        self.options = {
            json: '',
            fieldName: '',
            suggestions: '',
            search: {},
            advanced: {},

            // Methods
            initialize: function() {
                jQuery('ul.geo-tabs', self).tabs('div.geo-panes > div');
                var options = self.options.search;
                options.json = self.options.json;
                options.fieldName = self.options.fieldName;
                options.suggestions = self.options.suggestions;
                jQuery('.geo-results', self).geosearchtab(options);

                options = self.options.advanced;
                options.json = self.options.json;
                options.fieldName = self.options.fieldName;
                jQuery('.geo-advanced', self).geoadvancedtab(options);

            }
        };

        if (settings) {
            jQuery.extend(self.options, settings);
        }

        self.options.initialize();
        return this;
    };

    /* Geo search tab jQuery plugin */
    jQuery.fn.geosearchtab = function(settings) {
        var self = this;

        // Default settings
        self.options = {
            // Settings
            fieldName: '',
            json: '',
            suggestions: '',
            query: {
                address: '',
                q: '',
                maxRows: 10
            },

            handle_suggestions: function(data) {
                var suggestions = data.suggestions;

                if (!suggestions.length) {
                    return;
                }

                var htitle = jQuery('<h5>').text('Suggestions').addClass('geo-suggestions');
                self.resultsarea.append(htitle);

                var context = jQuery('#' + self.options.fieldName);

                jQuery.each(suggestions, function() {
                    self.options.query.address = this.text;
                    jQuery(context).trigger(jQuery.geoevents.ajax_start);
                    var xquery = {
                        'address': this.text
                    };
                    self.Geocoder.geocode(xquery, function(data) {
                        var features = [];
                        jQuery.each(data, function() {
                            features.push(jQuery.google2geojson(this));
                        });

                        var geojson = {
                            type: 'FeatureCollection',
                            features: features
                        };

                        self.options.handle_query(geojson, false);
                        jQuery(context).trigger(jQuery.geoevents.ajax_stop);
                    });
                });
            },

            // Handlers
            handle_submit: function() {
                self.searchbutton.removeClass('submitting');

                var value = self.searchtext.val();
                if (!value || (value === self.options.query.address)) {
                    return;
                }

                self.options.query.address = value;
                self.options.query.q = value;
                var query = self.options.query;

                var context = jQuery('#' + self.options.fieldName);
                jQuery(context).trigger(jQuery.geoevents.ajax_start);

                // Search with geonames.org
                jQuery.getJSON(self.options.json, query, function(data) {
                    if (data.features.length) {
                        self.options.handle_query(data, true);
                        jQuery(context).trigger(jQuery.geoevents.ajax_stop);
                    } else {
                        // Search with Google
                        var xquery = {
                            address: query.address
                        };
                        self.Geocoder.geocode(xquery, function(data) {
                            var features = [];
                            jQuery.each(data, function() {
                                features.push(jQuery.google2geojson(this));
                            });

                            data = {
                                type: 'FeatureCollection',
                                features: features
                            };

                            self.options.handle_query(data, true);
                            jQuery(context).trigger(jQuery.geoevents.ajax_stop);
                        });
                    }
                });
            },

            handle_query: function(data, reset) {
                self.results = data;
                if (reset) {
                    self.resultsarea.empty();

                    if (!self.results.features.length) {
                        var div = jQuery('<div>').addClass('geo-hints');
                        div.text('We could not find a match for this location anywhere. ' + 'Please check your spelling or try looking for a different location.');
                        self.resultsarea.append(div);
                        return;
                    }
                }

                jQuery.each(self.results.features, function() {
                    var div = jQuery('<div>');
                    div.geopointview({
                        fieldName: self.options.fieldName,
                        point: this
                    });
                    self.resultsarea.append(div);
                });
            },

            // Initialize
            initialize: function() {
                self.searchform = jQuery('form', self);
                self.searchbutton = jQuery('input[type=submit]', self.searchform);
                self.searchtext = jQuery('input[type=text]', self.searchform);
                self.resultsarea = jQuery('.geo-results-area', self);

                self.Geocoder = new google.maps.Geocoder();

                // Handle suggestions
                if (self.options.suggestions.length) {
                    jQuery.getJSON(self.options.suggestions, {}, function(data) {
                        self.options.handle_suggestions(data);
                    });
                }

                self.searchform.submit(function() {
                    self.options.handle_submit();
                    return false;
                });

            }
        };

        // Update settings
        if (settings) {
            jQuery.extend(self.options, settings);
        }

        self.options.initialize();
        return this;
    };

    /* Geo point view jQuery plugin */
    jQuery.fn.geopointview = function(settings) {
        var self = this;
        self.options = {
            fieldName: '',
            template: '<div>' + '<h3 class="title"></h3>' + '<h4 class="subtitle"></h4>' + '<h5 class="tags"></h5>' + '</div>',
            point: {},

            // Methods
            initialize: function() {
                self.addClass('geo-point-view').attr('title', 'See on map');
                var icon = jQuery('<div>')
                    .addClass('ui-icon')
                    .addClass('ui-icon-extlink')
                    .text('+');
                self.prepend(icon);

                var title = self.options.point.properties.title;
                var subtitle = self.options.point.properties.description;
                var tags = '';
                if (typeof(self.options.point.properties.tags) === 'string') {
                    tags = self.options.point.properties.tags;
                } else {
                    jQuery.each(self.options.point.properties.tags, function() {
                        tags += this + ', ';
                    });
                }

                var template = jQuery(self.options.template);
                jQuery('.title', template).text(title);
                jQuery('.subtitle', template).text(subtitle);
                jQuery('.tags', template).text(tags);

                self.append(template);

                var context = jQuery('#' + self.options.fieldName);
                self.click(function() {
                    jQuery(context).trigger(jQuery.geoevents.select_point, {
                        point: self.options.point,
                        target: self,
                        autoclick: true
                    });
                });
            }

        };

        if (settings) {
            jQuery.extend(self.options, settings);
        }

        // Return
        self.options.initialize();
        return this;
    };

    /* Geo advanced tab jQuery plugin */
    jQuery.fn.geoadvancedtab = function(settings) {
        var self = this;
        self.options = {
            fieldName: '',
            json: '',

            // Methods
            handle_biogroups_change: function() {
                var value = self.biogroups.val();

                if (!value) {
                    return;
                }

                var value_json = {};
                jQuery.each(self.biogroups.geojson.features, function() {
                    if (this.properties.name === value) {
                        value_json = this;
                        return false;
                    }
                });

                var context = jQuery('#' + self.options.fieldName);
                jQuery(context).trigger(jQuery.geoevents.select_point, {
                    point: value_json,
                    target: self.biogroups
                });
            },

            handle_groups_change_reset: function() {
                self.countries.empty().parent().hide();
                self.nuts.empty().parent().hide();
                self.cities.empty().parent().hide();
                self.naturalfeatures.empty().parent().hide();
            },

            handle_groups_change: function() {
                self.options.handle_groups_change_reset();

                var value = self.groups.val();
                if (!value) {
                    return;
                }

                var value_json = {};
                jQuery.each(self.data.features, function() {
                    if (this.properties.name === value) {
                        value_json = this;
                        return false;
                    }
                });

                var context = jQuery('#' + self.options.fieldName);

                // Get countries
                jQuery.getJSON(self.options.json, {
                    type: 'countries',
                    group: value
                }, function(data) {
                    // save initial country data to be used when adding country groups
                    if ($("#expand_countries").is(':checked')) {
                        window.EEAGeotags.initialCountryData = data;
                    }

                    self.countries.empty();
                    var option = jQuery('<option>').val('').text('');
                    self.countries.append(option);

                    jQuery.each(data.features, function(index) {
                        // Center map on second country in group
                        if (index === 1) {
                            value_json.properties.center = this.properties.center;
                            jQuery(context).trigger(jQuery.geoevents.select_point, {
                                point: value_json,
                                target: self.groups
                            });
                        }
                        // Add countries to datamodel
                        if (value_json.properties.countries === undefined) {
                            value_json.properties.countries = [];
                        }
                        value_json.properties.countries.push(this.properties.title);

                        option = jQuery('<option>')
                            .val(this.properties.name)
                            .text(this.properties.title)
                            .data('geojson', this);
                        self.countries.append(option);
                    });

                    self.countries.parent().show();
                });
            },

            handle_countries_change_reset: function() {
                self.nuts.empty().parent().hide();
                self.cities.empty().parent().hide();
                self.naturalfeatures.empty().parent().hide();
            },

            handle_countries_change: function() {
                self.options.handle_countries_change_reset();

                var country = jQuery('option:selected', self.countries);

                if (!country.length) {
                    return;
                }

                // Center map
                var query = {
                    address: country.data('geojson').properties.title,
                    region: country.data('geojson').properties.country
                };

                var context = jQuery('#' + self.options.fieldName);
                self.Geocoder.geocode(query, function(data) {
                    if (!data.length) {
                        return;
                    }

                    data = jQuery.google2geojson(data[0]);
                    jQuery(context).trigger(jQuery.geoevents.select_point, {
                        point: data,
                        target: self.countries
                    });
                });

                // Get nut regions
                jQuery.getJSON(self.options.json, {
                    type: 'nuts',
                    country: query.region
                }, function(data) {
                    self.nuts.empty();
                    var option = jQuery('<option>').val('').text('');
                    self.nuts.append(option);
                    jQuery.each(data.features, function() {
                        option = jQuery('<option>')
                            .val(this.properties.name)
                            .text(this.properties.title)
                            .data('geojson', this);
                        self.nuts.append(option);
                    });
                    self.nuts.parent().show();
                });

                // Get natural features
                jQuery.getJSON(self.options.json, {
                    type: 'natural',
                    country: query.region
                }, function(data) {
                    self.naturalfeatures.empty();
                    var option = jQuery('<option>').val('').text('');
                    self.naturalfeatures.append(option);
                    jQuery.each(data.features, function() {
                        option = jQuery('<option>')
                            .val(this.properties.name)
                            .text(this.properties.title)
                            .data('geojson', this);
                        self.naturalfeatures.append(option);
                    });
                    self.naturalfeatures.parent().show();
                });

            },

            handle_nuts_change_reset: function() {
                self.cities.empty().parent().hide();
            },

            handle_nuts_change: function() {
                self.options.handle_nuts_change_reset();

                var nut = jQuery('option:selected', self.nuts);
                if (!nut.length) {
                    return;
                }

                var query = {
                    address: nut.data('geojson').properties.adminName1,
                    region: nut.data('geojson').properties.country
                };

                var context = jQuery('#' + self.options.fieldName);
                // Center map
                self.Geocoder.geocode(query, function(data) {
                    if (!data.length) {
                        return;
                    }

                    data = jQuery.google2geojson(data[0]);
                    jQuery(context).trigger(jQuery.geoevents.select_point, {
                        point: data,
                        target: self.nuts
                    });
                });

                // Get cities
                var req = {
                    type: 'cities',
                    country: query.region,
                    adminCode1: nut.data('geojson').properties.adminCode1
                };

                jQuery.getJSON(self.options.json, req, function(data) {
                    self.cities.empty();
                    var option = jQuery('<option>').val('').text('');
                    self.cities.append(option);
                    jQuery.each(data.features, function() {
                        option = jQuery('<option>')
                            .val(this.properties.name)
                            .text(this.properties.title)
                            .data('geojson', this);
                        self.cities.append(option);
                    });
                    self.cities.parent().show();
                });

                //. Get natural features
                var req_natural = {
                    type: 'natural',
                    country: req.country,
                    adminCode1: req.adminCode1
                };

                jQuery.getJSON(self.options.json, req_natural, function(data) {
                    self.naturalfeatures.empty();
                    var option = jQuery('<option>').val('').text('');
                    self.naturalfeatures.append(option);
                    jQuery.each(data.features, function() {
                        option = jQuery('<option>')
                            .val(this.properties.name)
                            .text(this.properties.title)
                            .data('geojson', this);
                        self.naturalfeatures.append(option);
                    });
                    self.naturalfeatures.parent().show();
                });

            },

            handle_cities_change: function() {
                var city = jQuery('option:selected', self.cities);
                if (!city.length) {
                    return;
                }

                // Center map
                var query = {
                    address: city.data('geojson').properties.title + ', ' + city.data('geojson').properties.adminName1,
                    region: city.data('geojson').properties.country
                };

                var context = jQuery('#' + self.options.fieldName);
                self.Geocoder.geocode(query, function(data) {
                    if (!data.length) {
                        return;
                    }

                    data = jQuery.google2geojson(data[0]);
                    jQuery(context).trigger(jQuery.geoevents.select_point, {
                        point: data,
                        target: self.cities
                    });
                });
            },

            handle_naturalfeatures_change: function() {
                var natural = jQuery('option:selected', self.naturalfeatures);
                if (!natural.length) {
                    return;
                }

                // Center map
                var query = {
                    address: natural.data('geojson').properties.title + ', ' + natural.data('geojson').properties.adminName1,
                    region: natural.data('geojson').properties.country
                };

                var context = jQuery('#' + self.options.fieldName);
                self.Geocoder.geocode(query, function(data) {
                    if (!data.length) {
                        return;
                    }

                    data = jQuery.google2geojson(data[0]);
                    jQuery(context).trigger(jQuery.geoevents.select_point, {
                        point: data,
                        target: self.naturalfeatures
                    });
                });
            },

            // Initialize
            initialize: function() {
                self.biogroups = jQuery('select[name=biogroups]', self);
                self.groups = jQuery('select[name=groups]', self);
                self.countries = jQuery('select[name=countries]', self);
                self.nuts = jQuery('select[name=nuts]', self);
                self.cities = jQuery('select[name=cities]', self);
                self.naturalfeatures = jQuery('select[name=naturalfeature]', self);
                self.data = {};

                self.Geocoder = new google.maps.Geocoder();

                // Hide
                self.countries.parent().hide();
                self.nuts.parent().hide();
                self.cities.parent().hide();
                self.naturalfeatures.parent().hide();

                // Fill biogeographical regions
                jQuery.getJSON(self.options.json, {
                    type: 'biogroups'
                }, function(data) {
                    self.biogroups.empty();
                    var option = jQuery('<option>').val('').text('');
                    self.biogroups.append(option);
                    jQuery.each(data.features, function() {
                        self.biogroups.geojson = data;
                        option = jQuery('<option>')
                            .val(this.properties.name)
                            .text(this.properties.title);
                        self.biogroups.append(option);
                    });
                });

                // Fill groups
                jQuery.getJSON(self.options.json, {
                    type: 'groups'
                }, function(data) {
                    self.data = data;
                    self.groups.empty();
                    var option = jQuery('<option>').val('').text('');
                    self.groups.append(option);
                    jQuery.each(self.data.features, function() {
                        option = jQuery('<option>')
                            .val(this.properties.name)
                            .text(this.properties.title);
                        self.groups.append(option);
                    });
                });

                // Events
                self.biogroups.change(function() {
                    self.options.handle_biogroups_change();
                });

                self.groups.change(function() {
                    self.options.handle_groups_change();
                });

                self.countries.change(function() {
                    self.options.handle_countries_change();
                });

                self.nuts.change(function() {
                    self.options.handle_nuts_change();
                });

                self.cities.change(function() {
                    self.options.handle_cities_change();
                });

                self.naturalfeatures.change(function() {
                    self.options.handle_naturalfeatures_change();
                });
            }
        };

        if (settings) {
            jQuery.extend(self.options, settings);
        }

        // Return
        self.options.initialize();
        return this;
    };

    jQuery.fn.geopreview = function(settings) {
        var self = this;
        self.options = {
            json: {},
            fieldName: '',
            template: '<div><div class="geo-preview-marker">' + '<h3 class="title"></h3>' + '<h4 class="subtitle"></h4>' + '<h5 class="tags"></h5>' + '</div></div>',
            map_options: {
                latitude: 55,
                longitude: 35,
                center: null,
                zoom: 3,
                navigationControl: true,
                navigationControlOptions: {
                    style: google.maps.NavigationControlStyle.ZOOM_PAN
                    //        position: google.maps.ControlPosition.RIGHT // this generated a javascript error in IE
                },
                mapTypeControl: true,
                mapTypeControlOptions: {
                    position: google.maps.ControlPosition.TOP_RIGHT,
                    style: google.maps.MapTypeControlStyle.DEFAULT
                },
                mapTypeId: google.maps.MapTypeId.TERRAIN
            },

            handle_points: function(json) {
                self.options.handle_cleanup();
                if (!json.features) {
                    return;
                }

                jQuery.each(json.features, function() {
                    var center = this.properties.center;
                    var latlng = new google.maps.LatLng(center[0], center[1]);
                    var marker = new google.maps.Marker({
                        position: latlng
                    });
                    marker.setMap(self.Map);
                    self.markers.push(marker);

                    var title = this.properties.title;
                    var subtitle = this.properties.description;
                    var tags = '';
                    if (typeof(this.properties.tags) === 'string') {
                        tags = this.properties.tags;
                    } else {
                        jQuery.each(this.properties.tags, function() {
                            tags += this + ', ';
                        });
                    }

                    var itemplate = jQuery(self.options.template);
                    jQuery('.title', itemplate).text(title);
                    jQuery('.subtitle', itemplate).text(subtitle);
                    jQuery('.tags', itemplate).text(tags);

                    // Google event handlers
                    google.maps.event.addListener(marker, 'click', function() {
                        self.info.setContent(itemplate.html());
                        self.info.open(self.Map, marker);
                    });
                });
            },

            handle_cleanup: function() {
                jQuery.each(self.markers, function() {
                    this.setMap(null);
                });
                self.markers.length = 0;

                if (self.info) {
                    self.info.close();
                }
            },

            initialize: function() {
                self.markers = [];
                self.info = new google.maps.InfoWindow({
                    content: ''
                });

                self.addClass('geo-preview-mapcanvas');
                var options = self.options.map_options;
                if (!options.latlng) {
                    options.center = new google.maps.LatLng(
                    options.latitude,
                    options.longitude);
                }

                self.Map = new google.maps.Map(self[0], options);
                self.Geocoder = new google.maps.Geocoder();

                self.options.handle_points(self.options.json);
                var context = jQuery('#' + self.options.fieldName);
                context.bind(jQuery.geoevents.basket_save, function(evt, data) {
                    self.options.handle_points(data.json);
                });

                // Fix preview map
                jQuery('form[name=edit_form] .formTab, .wizard-left, .wizard-right').click(function() {
                    // #5339 fix preview map also when using eea.forms
                    if (jQuery(this).closest('form').find('.formPanel:visible').find('#location-geopreview').length) {
                        google.maps.event.trigger(self.Map, 'resize');
                        self.Map.setCenter(options.center);
                        self.Map.setZoom(options.zoom);
                    }
                });
            }
        };

        if (settings) {
            jQuery.extend(self.options, settings);
        }

        // Return
        self.options.initialize();
        return this;
    };

    // End namespace
}());


if (window.EEAGeotags === undefined) {
    var EEAGeotags = {
        'version': '1.0'
    };
}

// EEA Geotags view widget on map
EEAGeotags.View = function(context, options) {
    var self = this;
    self.map = '';
    self.context = context;
    self.context.parent().addClass('eea-geotags-view');
    self.settings = {};

    if (options) {
        jQuery.extend(self.settings, options);
    }
    EEAGeotags.settings = self.settings;
    self.initialize();
};

EEAGeotags.View.prototype = {

    initialize: function() {
        var self = this;
        dojo.require('dijit.layout.BorderContainer');
        dojo.require('dijit.layout.ContentPane');
        dojo.require('esri.map');
        dojo.require('esri.dijit.Scalebar');
        dojo.require("esri.layers.FeatureLayer");
        dojo.require("esri.dijit.Popup");
        self.init();
    },

    init: function() {
        var self = this,
            eea_location = jQuery('.eea-location-listing'),
            eea_location_links = eea_location.find('a'),
            eea_location_links_length = eea_location_links.length,
            eea_location_data = eea_location.data();
        self.modal = eea_location_links_length ? eea_location_data.modal : "Events";
        self.map_div = jQuery("#eeaEsriMap");
        if ((self.modal !== "False" && self.modal !== "Events") || (eea_location_links_length < 4 && self.modal !== "Events")) {
            var dialogBox,
            eea_location_offset = eea_location.is(':visible') ? eea_location.offset() : eea_location.closest(':visible').offset(),
                pos_top = eea_location_offset.top + eea_location.height(),
                pos_left = eea_location_offset.left,
                body = jQuery('html, body');
            // CREATE MAP
            self.map_div.show();
            self.initMap(eea_location_links);
            self.map_div.hide();
            eea_location_links.click(function(e) {
                if (!dialogBox) {
                    // ie bug which fails if we have open and width and height in
                    // the dialog options so we add then with plain jquery css
                    dialogBox = self.map_div.dialog({
                        closeOnEscape: true,
                        autoOpen: false,
                        resize: true
                    });
                    dialogBox.closest('.ui-dialog').css({
                        left: pos_left,
                        top: pos_top,
                        display: 'block',
                        width: eea_location_data.modal_dimensions[0],
                        height: eea_location_data.modal_dimensions[1]
                    });
                    // resize map root to fit the designated space of #content
                    // without scrollbars
                    self.map_div.find('#eeaEsriMap_root').css({
                        width: '100%',
                        height: '100%'
                    });

                } else {
                    dialogBox.closest('.ui-dialog').css({
                        left: pos_left,
                        top: pos_top,
                        display: 'block'
                    });
                }
                e.preventDefault();
            });
        } else {
            self.map_div.show();
            self.initMap(eea_location_links);
        }
    },
    // Show loading image
    showLoading: function() {
        var loading;
        var self = this;
        loading = jQuery('#eeaEsriMapLoadingImg')[0];
        esri.show(loading);
        self.disableMapNavigation();
        self.hideZoomSlider();
    },

    // Hide loading image
    hideLoading: function() {
        var loading;
        var self = this;
        loading = jQuery('#eeaEsriMapLoadingImg')[0];
        esri.hide(loading);
        self.enableMapNavigation();
        self.showZoomSlider();
    },

    // Draw points on map
    drawPoints: function(eea_location_links) {
        var self = this,
            context_url, infoSymbol, infoTemplate, map_points, locationTags, locationTagsLen;
        map_points = jQuery('#map_points');
        locationTags = eea_location_links;
        locationTagsLen = locationTags ? locationTags.length : 0;

        context_url = window.location.protocol + '//' + window.location.host + window.location.pathname;

        infoSymbol = new esri.symbol.SimpleMarkerSymbol().setSize(10).setColor(new dojo.Color('#B1C748'));
        var infotemplate = map_points.length ? '${Title}<img src="${Url}/image_thumb" class="esriInfoImg" />' : '${Addr}';
        infoTemplate = new esri.InfoTemplate('${Name}', infotemplate);
        EEAGeotags.map.infoWindow.hide();
        var featureCollection = {
            "layerDefinition": null,
            "featureSet": {
                "features": [],
                "geometryType": "esriGeometryPoint"
            }
        };
        var renderer;
        var portal = EEAGeotags.settings.portal_url ? EEAGeotags.settings.portal_url + "/" : "/";
        if (self.modal === "Events") {
            renderer = {
                "type": "simple",
                "symbol": {
                    "type": "esriPMS",
                    "url": portal + EEAGeotags.settings.infoWindowImgName,
                    "width": 15,
                    "height": 15
                }
            };
        }
        featureCollection.layerDefinition = {
            "geometryType": "esriGeometryPoint",
            "objectIdField": "ObjectID",
            "drawingInfo": {
                "renderer": EEAGeotags.settings.featureCollectionRenderer || renderer
            },
            "fields": [{
                "name": "ObjectID",
                "alias": "ObjectID",
                "type": "esriFieldTypeOID"
            }, {
                "name": "description",
                "alias": "Description",
                "type": "esriFieldTypeString"
            }, {
                "name": "title",
                "alias": "Title",
                "type": "esriFieldTypeString"
            }]
        };

        // remove previous graphics before adding new ones with faceted navigation
        // queries
        if (EEAGeotags.featureLayer) {
            EEAGeotags.featureLayer.clear();
        }
        var setPoints = function(res, results) {
            //define a popup template
            var popup = new esri.dijit.Popup(null, dojo.create("div"));
            EEAGeotags.map.setInfoWindow(popup);
            var popupTemplate = new esri.dijit.PopupTemplate({
                title: "{title}",
                description: "{description}"
            });
            //create a feature layer based on the feature collection
            var featureLayer = new esri.layers.FeatureLayer(res, {
                id: 'geotagsLayer',
                infoTemplate: popupTemplate
            });


            // add or change read more link for pop-up
            dojo.connect(popup, "onSelectionChange", function() {
                var feature = popup.getSelectedFeature();
                var readmeLink = dojo.query(".readmore", EEAGeotags.map.infoWindow.domNode)[0];
                if (feature && feature.attributes.Url) {
                    if (!readmeLink) {
                        dojo.create("a", {
                            "class": "action readmore",
                            "innerHTML": "Read More",
                            "href": feature.attributes.Url
                        }, dojo.query(".actionList", EEAGeotags.map.infoWindow.domNode)[0]);
                    } else {
                        readmeLink.href = feature.attributes.Url;
                    }
                }
            });

            //associate the features with the popup on click
            dojo.connect(featureLayer, "onClick", function(evt) {
                var features = [];
                dojo.forEach(featureLayer.graphics, function(item) {
                    if (evt.graphic.geometry.x === item.geometry.x && evt.graphic.geometry.y === item.geometry.y) {
                        features.push(item);
                    }
                });
                popup.hide();
                EEAGeotags.map.infoWindow.setFeatures(features);
            });

            var features = [];
            var initialTemplate = infoTemplate.content,
                tempTemplate = "";
            var wgs = new esri.SpatialReference({
                "wkid": 102100
            });
            jQuery.each(results, function(i, item) {
                var geometry, mapPoint, attributes;
                geometry = new esri.geometry.Point(parseFloat(item.properties.center[1]), parseFloat(item.properties.center[0]), wgs);
                geometry = esri.geometry.geographicToWebMercator(geometry);
                var name = item.itemType || 'Location',
                    itemUrl = item.itemUrl || context_url,
                    icon = item.itemIcon || portal_url + "/red_pin.png",
                    addr = decodeURIComponent(item.properties.description) || decodeURIComponent(item.properties.title),
                    itemDate = item.itemDate,
                    itemDescription = item.itemDescription,
                    itemTitle = item.itemTitle ? '<h3>' + decodeURIComponent(item.itemTitle) + '</h3>' : '',
                    mapOptions = {
                        'Name': name,
                        'Url': itemUrl,
                        'Title': itemTitle
                    };

                // add extra template information only if it's available from the catalog search
                tempTemplate = initialTemplate;

                if (addr) {
                    tempTemplate = tempTemplate + '<p><strong>Location: </strong>${Addr}</p>';
                    mapOptions.Addr = addr;
                }
                if (itemDate && parseInt(itemDate, 10)) {
                    tempTemplate = tempTemplate + '<p><strong>Period: </strong>${Period}</p>';
                    mapOptions.Period = itemDate;
                }
                if (itemDescription && itemDescription.length > 5) {
                    tempTemplate = tempTemplate + '<p><strong>Description: </strong>${Desc}</p>';
                    mapOptions.Desc = decodeURIComponent(itemDescription);
                }
                // we need to recreate the infoTemplate otherwise all features will use the
                // same infoTemplate which will have it's content changed along the way
                infoTemplate = new esri.InfoTemplate('${Name}', tempTemplate);
                mapPoint = new esri.Graphic({
                    'geometry': geometry,
                    'attributes': mapOptions
                });
                mapPoint.setInfoTemplate(infoTemplate);
                if (!EEAGeotags.settings.generalIcon) {
                    mapPoint.setSymbol(new esri.symbol.PictureMarkerSymbol(icon, 30, 30));
                }
                features.push(mapPoint);
                // set latitude and longitude on each tag as data attribute
                if (locationTagsLen) {
                    jQuery(locationTags[i]).data('latitude', item.properties.center[1]);
                    jQuery(locationTags[i]).data('longitude', item.properties.center[0]);
                }
            });
            // first is add, second is update, third is delete parameter
            featureLayer.applyEdits(features, null, null);

            EEAGeotags.map.addLayers([featureLayer]);
            EEAGeotags.featureLayer = featureLayer;

            var enableClusterLayer = function() {
                // cluster points
                var cluster = dojo.map(features, function(item) {
                    return {
                        "x": item.geometry.x,
                        "y": item.geometry.y,
                        "attributes": item.attributes,
                        'template': item.infoTemplate
                    };
                });

                var clusterLayer = new window.EEAGeotags.GeotagsClusterLayer({
                    "data": cluster,
                    "distance": 100,
                    "id": "clusters",
                    "labelColor": "#fff",
                    "labelOffset": 10,
                    "resolution": EEAGeotags.map.extent.getWidth() / EEAGeotags.map.width,
                    "singleColor": "#888"
                });
                var defaultSym = new esri.symbol.SimpleMarkerSymbol().setSize(4);
                var renderer = new esri.renderer.ClassBreaksRenderer(
                defaultSym, "clusterCount");
                var greenSymbol = new esri.symbol.PictureMarkerSymbol("http://static.arcgis.com/images/Symbols/Shapes/GreenPin1LargeB.png", 64, 64).setOffset(0, 15);
                var redSymbol = new esri.symbol.PictureMarkerSymbol("http://static.arcgis.com/images/Symbols/Shapes/RedPin1LargeB.png", 72, 72).setOffset(0, 15);
                renderer.addBreak(2, 200, greenSymbol);
                renderer.addBreak(200, 1001, redSymbol);

                clusterLayer.setRenderer(renderer);
                EEAGeotags.map.addLayer(clusterLayer);
            };
            if (window.EEAGeotags.GeotagsClusterLayer) {
                enableClusterLayer();
            }

        };

        if (map_points.length && map_points.html() !== "None") {
            var results = map_points.html();
            results = results.replace(/'/g, "");

            results = jQuery.parseJSON(results);
            setPoints(featureCollection, results);
        } else {
            jQuery.getJSON(context_url + '/eea.geotags.jsondata', {}, function(res) {
                setPoints(featureCollection, res.features);
                //center map and display infoWindow when clicking on a geotag
                locationTags.click(function(e) {
                    var geometryClick;
                    geometryClick = new esri.geometry.Point(jQuery(this).data('latitude'), jQuery(this).data('longitude'));
                    geometryClick = esri.geometry.geographicToWebMercator(geometryClick);
                    // show infoWindow after clicking on tag name
                    var location = jQuery.grep(EEAGeotags.featureLayer.graphics, function(i) {
                        return i.geometry.x === geometryClick.x && i.geometry.y === geometryClick.y;
                    })[0];
                    var point = location.geometry;
                    EEAGeotags.map.infoWindow.setFeatures([location]);
                    EEAGeotags.map.infoWindow.show(point, self.map.getInfoWindowAnchor(point));
                    self.map.infoWindow.resize(250, 150);
                    EEAGeotags.map.centerAndZoom(point, 6);
                    EEAGeotags.map.resize();
                    e.preventDefault();
                });

                if (self.modal === "Events") {
                    locationTags.eq(0).trigger('click');
                }
            });
        }
    },

    // Create map
    initMap: function(eea_location_links) {
        // To get initial coordinates, zoom to default location and run in debugger: dojo.toJson(EEAGeotags.map.extent.toJson());
        var self = this;
        var initExtent, basemap, geometricExtent;
        initExtent = new esri.geometry.Extent({
            "xmin": -171,
            "ymin": -330,
            "xmax": 240,
            "ymax": 140,
            "spatialReference": {
                "wkid": 102100
            }
        });
        geometricExtent = esri.geometry.geographicToWebMercator(initExtent);
        basemap = new esri.layers.ArcGISTiledMapServiceLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer');
        self.map = new esri.Map('eeaEsriMap', {
            'extent': geometricExtent,
            'wrapAround180': true,
            'fadeOnZoom': true,
            'force3DTransforms': true,
            'isScrollWheelZoom': false,
            'navigationMode': 'css-transforms'
        });
        self.map.addLayer(basemap);
        EEAGeotags.map = self.map;
        // Loading images
        dojo.connect(self.map, 'onUpdateStart', self.showLoading);
        dojo.connect(self.map, 'onUpdateEnd', self.hideLoading);

        dojo.connect(self.map, 'onLoad', function() {
            // Resize the map when the browser resizes
            // zoom in by a factor of 2 in order to avoid having map smaller than container
            EEAGeotags.map.centerAndZoom(EEAGeotags.map.extent.getCenter(), 2);

            dojo.ready(function() {
                dojo.connect(dijit.byId('eeaEsriMap'), 'resize', self.map, self.map.resize);
                var resize = self.settings.infoWindowSize;
                resize = resize || [140, 100];
                self.map.infoWindow.resize(resize[0], resize[1]);

                // Draw a point on map
                self.drawPoints(eea_location_links);

                // Scalebar
                var scalebar = new esri.dijit.Scalebar({
                    map: self.map,
                    scalebarUnit: 'metric', // Use 'english' for miles
                    attachTo: 'bottom-left'
                });

                // Hack to disable scroll wheel zooming, as map.disableScrollWheelZoom() has no effect
                self.map.onMouseWheel = function() {};
            });

            jQuery('body').trigger('EEAGeotags.MapLoaded');
        });
    }
};

// jQuery plugin for EEAGeotags.View
jQuery.fn.EEAGeotagsView = function(options) {
    return this.each(function() {
        var context = jQuery(this).addClass('eea-ajax');
        var geoview = new EEAGeotags.View(context, options);
        context.data('EEAGeotagsView', geoview);
    });
};

/* - eea.geotags.map.js - */
jQuery(document).ready(function($) {
    window.djConfig = {
        parseOnLoad: true,
        baseUrl: '.',
        modulePaths: {
            'EEAGeotags': '.'
        }
    };
    var url = "http://serverapi.arcgisonline.com/jsapi/arcgis/?v=2.8",
        map, map_options,
        portal_url = $("#portal_url").html(),
        feature_collection_renderer = {
            "type": "simple",
            "symbol": {
                "type": "esriPMS",
                "url": portal_url + "/event_icon.gif",
                "contentType": "image/gif",
                "width": 15,
                "height": 15
            }
        };
    map_options = {
        'infoWindowSize': [350, 200],
        'portalUrl': portal_url,
        'featureCollectionRenderer': feature_collection_renderer
    };
    if ($('#faceted-form').length) {
        $(window.Faceted.Events).one('FACETED-AJAX-QUERY-SUCCESS', function() {
            if ($("#map_points").length) {
                var portal_url = $("#portal_url").html(),
                    geotags_cluster_url = portal_url + '/geotagsClusterLayer.js';
                map_options.featureCollectionRenderer.symbol.url = portal_url + "/event_icon.gif";
                map_options.portalUrl = portal_url;
                map = $('#eeaEsriMap');
                map.insertBefore("#content-core");
                $.getScript(url, function() {
                    window.dojo.ready(function() {
                        $.getScript(geotags_cluster_url, function(res) {
                            map.EEAGeotagsView(map_options);
                        });
                    });
                });
                $(window.Faceted.Events).bind('FACETED-AJAX-QUERY-SUCCESS', function() {
                    window.EEAGeotags.View.prototype.drawPoints();
                });
            }
        });
    } else {
        if ($("#map_points").length) {
            $.getScript(url, function() {
                window.dojo.ready(function() {
                    var geotags_cluster_url = portal_url + '/geotagsClusterLayer.js';
                    $.getScript(geotags_cluster_url, function() {
                        map = $("#eeaEsriMap");
                        map.EEAGeotagsView(map_options);
                    });
                });
            });
        }
    }
});


/* - eea-fancybox.js - */
// http://www.eea.europa.eu/portal_javascripts/eea-fancybox.js?original=1
jQuery(document).ready(function($) {
    if ($.fn.fancybox !== undefined) {
        $('.fancybox').fancybox();
        $('.gallery-fancybox').each(function() {
            var href = $(this).attr('href') + "/gallery_fancybox_view";
            $(this).attr('href', href);
            $(this).fancybox({
                type: 'iframe',
                padding: 0,
                margin: 0,
                width: 650,
                height: 500,
                scrolling: 'no',
                autoScale: false,
                autoDimensions: false
            })
        })
    }
});

/* - eea-mediacentre.js - */
// http://www.eea.europa.eu/portal_javascripts/eea-mediacentre.js?original=1
(function($) {
    $(document).ready(function() {
        var $region_content = $("#region-content"),
            $objmeta = $region_content.find('#objmetadata_pbwidgets_wrapper');
        if ($objmeta.length) {
            $region_content.find("dd:contains('video')").closest('dl').hide()
        }
        window.EEA = window.EEA || {};
        var EEA = window.EEA;
        var playVideo = function(link) {
            var $link = $(link);
            if (!$link.data('multimedia')) {
                var coverflow = $("#multimedia-coverflow"),
                    video_page = coverflow.length > 0 ? 1 : 0;
                var parent = link;
                var href = link.href;
                var isInsidePopUp = $('body').hasClass('video_popup_view');
                var options = {
                    type: 'iframe',
                    padding: 0,
                    margin: 0,
                    width: 640,
                    height: 564,
                    scrolling: 'no',
                    autoScale: false,
                    autoDimensions: false,
                    centerOnScroll: false,
                    titleShow: false
                };
                if (video_page === 0) {
                    if (href.indexOf('video_popup_view') === -1) {
                        link.href = href.replace(/view$/, 'video_popup_view')
                    }
                }
                if (video_page) {
                    if (href.indexOf('multimedia_popup_view') === -1) {
                        var regex = /view$|video_popup_view|multimedia_popup_view/;
                        var clean_href = href.replace(regex, '');
                        if (href.indexOf('youtube') === -1 && href.indexOf('vimeo') === -1) {
                            link.href = clean_href + "multimedia_popup_view";
                            $("#fancybox-title").remove()
                        } else {
                            options.titlePosition = 'inside';
                            options.titleShow = true
                        }
                    }
                    var mult = coverflow.offset(),
                        bg = window.whatsnew.multimedia.bg,
                        bg2 = window.whatsnew.multimedia.bg2,
                        $parent = $(parent),
                        src = $parent.find('img');
                    var thumb_url = src.length !== 0 ? src[0].src : $parent.closest('div').prev().children()[0].src;
                    options.height = 387;
                    options.overlayShow = false;
                    options.onStart = function() {
                        var media_player = $("#media-player");
                        if (media_player.is(":visible")) {
                            media_player.fadeOut('fast', function() {
                                $("#contentFlow").fadeIn('slow')
                            });
                            $("#media-flowplayer").children().remove()
                        }
                        $.fancybox.center = function() {
                            return false
                        };
                        $('html, body').animate({
                            scrollTop: 0
                        }, 200, 'linear');
                        $("#fancybox-wrap").hide().css({
                            position: 'absolute'
                        }).animate({
                            left: mult.left - 20,
                            top: mult.top - 20
                        }, 200);
                        window.setTimeout(function() {
                            if (href.indexOf('youtube') !== -1 || href.indexOf('vimeo') !== -1) {
                                $("#fancybox-title").remove().prependTo('#fancybox-content')
                            }
                        }, 200)
                    };
                    var info_area = function(iframe, iframe_src, $parent) {
                        var frame, tab_desc, video_title, iframe_eea = iframe_src.indexOf('eea');
                        if (iframe_eea !== -1) {
                            frame = iframe.contents();
                            tab_desc = frame.find("#tab-desc");
                            video_title = frame.find("#video-title").text()
                        }
                        if (!tab_desc) {
                            tab_desc = $($parent).find('p').html()
                        }
                        video_title = video_title || $("#fancybox-title").text();
                        var featured_item = $("#featured-items");
                        var featured_item_title = featured_item.find("h3");
                        featured_item_title.text(video_title);
                        var featured_description = featured_item.find(".featured-description");
                        $("#featured-films").fadeOut();
                        tab_desc = tab_desc || $('.photoAlbumEntryDescription', $parent).text();
                        featured_description.html(tab_desc).end().fadeIn();
                        var title_height = featured_item_title.height();
                        var desc_height;
                        if (title_height === 21) {
                            desc_height = "184px"
                        } else if (title_height === 42) {
                            desc_height = "163px"
                        } else {
                            desc_height = "142px"
                        }
                        featured_description.css({
                            height: desc_height
                        });
                        var orig_href = iframe_eea !== -1 ? href.replace(/multimedia_popup_view/, 'view') : href.replace('embed/', 'watch?v=');
                        featured_item.find(".bookmark-link").attr("href", orig_href)
                    };
                    options.onComplete = function($parent) {
                        var iframe = $("#fancybox-frame"),
                            iframe_src = iframe.attr('src');
                        if (iframe_src.indexOf('youtube') !== -1 || iframe_src.indexOf('vimeo') !== -1) {
                            iframe.attr({
                                width: 640,
                                height: 360
                            }).css('height', '360px')
                        } else {
                            iframe.attr({
                                width: 640,
                                height: 387
                            })
                        }
                        iframe.one("load", function() {
                            info_area(iframe, iframe_src, $parent)
                        })
                    };
                    options.href = link.href
                }
                if (!isInsidePopUp) {
                    $(link).fancybox(options)
                }
                $link.data('multimedia', true);
                $link.click()
            }
        };
        EEA.playVideo = playVideo;

        function prepareVideoLinkURLs() {
            var isInsidePopUp = $('body').hasClass('video_popup_view');
            $('.video-fancybox').each(function() {
                var regex = /(\/$|\/view\/?$|\/video_popup_view\/?$)/;
                var href = $(this).attr('href');
                href = href.replace(regex, '');
                href = href + "/video_popup_view";
                this.href = href
            });
            $("body").delegate(".video-fancybox", "click", function(evt) {
                playVideo(this);
                if (!isInsidePopUp) {
                    evt.preventDefault()
                }
            })
        }
        prepareVideoLinkURLs();
        if ($.fn.fancybox === undefined) {
            return
        }
        if (window.Faceted) {
            jQuery(window.Faceted.Events).bind(window.Faceted.Events.AJAX_QUERY_SUCCESS, function(evt) {
                prepareVideoLinkURLs()
            })
        }
    })
}(jQuery));

/* - eea-autoscroll.js - */
// http://www.eea.europa.eu/portal_javascripts/eea-autoscroll.js?original=1
jQuery(document).ready(function($) {
    if ($('.autoscroll-to-here').length) {
        var top = $('.autoscroll-to-here').offset().top;
        $('html,body').animate({
            scrollTop: top
        }, 1000)
    }
});

/* - eea-tooltips.js - */
// http://www.eea.europa.eu/portal_javascripts/eea-tooltips.js?original=1
jQuery(document).ready(function($) {
    if ($.fn.tooltip !== undefined) {
        $(".eea-tooltip-top").each(function(i) {
            var title = $(this).attr("title");
            $(this).tooltip({
                effect: 'fade',
                tipClass: 'eea-tooltip-markup-top'
            })
        });
        $(".eea-tooltip-bottom").each(function(i) {
            var title = $(this).attr("title");
            $(this).tooltip({
                effect: 'fade',
                position: 'bottom center',
                tipClass: 'eea-tooltip-markup-bottom'
            })
        });
        $(".eea-tooltip-left").each(function(i) {
            var title = $(this).attr("title");
            $(this).tooltip({
                effect: 'fade',
                position: 'center left',
                tipClass: 'eea-tooltip-markup-left'
            })
        });
        $(".eea-tooltip-right").each(function(i) {
            var title = $(this).attr("title");
            $(this).tooltip({
                effect: 'fade',
                position: 'center right',
                tipClass: 'eea-tooltip-markup-right'
            })
        });
        var removeExtraText = function() {
            this.getTip()[0].lastChild.nodeValue = ''
        };
        $(".eea-flexible-tooltip-right").each(function(i) {
            var title = $(this).attr("title");
            var container = $('<div>').addClass('eea-tooltip-markup');
            var bottomright = $('<div>').addClass('tooltip-box-br');
            var topleft = $('<div>').addClass('tooltip-box-tl');
            var content = $('<div>').addClass('tooltip-box-rcontent');
            content.text(title);
            topleft.append(content);
            bottomright.append(topleft);
            container.append(bottomright);
            $(this).tooltip({
                effect: 'fade',
                position: 'center right',
                offset: [20, 20],
                tipClass: 'eea-tooltip-markup',
                layout: container,
                onBeforeShow: removeExtraText
            })
        });
        $(".eea-flexible-tooltip-left").each(function(i) {
            var title = $(this).attr("title");
            var container = $('<div>').addClass('eea-tooltip-markup');
            var bottomright = $('<div>').addClass('tooltip-box-br');
            var topleft = $('<div>').addClass('tooltip-box-tl');
            var content = $('<div>').addClass('tooltip-box-lcontent');
            content.text(title);
            topleft.append(content);
            bottomright.append(topleft);
            container.append(bottomright);
            $(this).tooltip({
                effect: 'fade',
                position: 'center left',
                offset: [20, - 10],
                tipClass: 'eea-tooltip-markup',
                layout: container,
                onBeforeShow: removeExtraText
            })
        });
        $(".eea-flexible-tooltip-top").each(function(i) {
            var title = $(this).attr("title");
            var container = $('<div>').addClass('eea-tooltip-markup');
            var bottomright = $('<div>').addClass('tooltip-box-br');
            var topleft = $('<div>').addClass('tooltip-box-tl');
            var content = $('<div>').addClass('tooltip-box-tcontent');
            content.text(title);
            topleft.append(content);
            bottomright.append(topleft);
            container.append(bottomright);
            $(this).tooltip({
                effect: 'fade',
                position: 'top center',
                offset: [10, 0],
                tipClass: 'eea-tooltip-markup',
                layout: container,
                onBeforeShow: removeExtraText
            })
        });
        $(".eea-flexible-tooltip-bottom").each(function(i) {
            var title = $(this).attr("title");
            var container = $('<div>').addClass('eea-tooltip-markup');
            var bottomright = $('<div>').addClass('tooltip-box-br');
            var topleft = $('<div>').addClass('tooltip-box-tl');
            var content = $('<div>').addClass('tooltip-box-bcontent');
            content.text(title);
            topleft.append(content);
            bottomright.append(topleft);
            container.append(bottomright);
            $(this).tooltip({
                effect: 'fade',
                position: 'bottom center',
                offset: [30, 0],
                tipClass: 'eea-tooltip-markup',
                layout: container,
                onBeforeShow: removeExtraText
            })
        })
    }
});

/* - eea-galleryview.js - */
// http://www.eea.europa.eu/portal_javascripts/eea-galleryview.js?original=1
(function($) {
    $(document).ready(function() {
        if ($.fn.galleryView !== undefined) {
            $.fn.eeaGalleryView = function(opts) {
                return this.each(function() {
                    if ($.data(this, 'visited')) {
                        return
                    }
                    var $this = $(this);
                    var $gallery_parent = $this.parent(),
                        $gallery_class = $gallery_parent[0].className,
                        parent_width, parent_height, gallery_width, gallery_height;
                    parent_width = $gallery_parent.width() - 10;
                    parent_height = Math.round((parent_width / 4) * 3);
                    gallery_width = $gallery_class === 'gallery_fancybox_view' ? 640 : parent_width;
                    gallery_height = $gallery_class === 'gallery_fancybox_view' ? 433 : parent_height;
                    var defaults = {
                        panel_width: gallery_width,
                        panel_height: gallery_height,
                        frame_width: 50,
                        frame_height: 50,
                        transition_speed: 350,
                        transition_interval: 10000
                    };
                    var options = $.extend(defaults, opts);
                    $this.galleryView(options);
                    $.data(this, 'visited', 'true')
                })
            };
            $("#galleryView, .galleryView").eeaGalleryView()
        }
    })
}(jQuery));

/* - eea-toc.js - */
// http://www.eea.europa.eu/portal_javascripts/eea-toc.js?original=1
function build_toc(toc) {
    var tocID = toc.attr('id');
    if (!toc.hasClass('collapsable-portlet')) {
        toc.addClass('collapsable-portlet')
    }
    var currentList = toc.find('.portletItem');
    var hLevel = null;
    var lists = {
        'root': currentList
    };
    lists.root.detach();
    var queryString = $('#queryString').html();
    queryString = queryString || "h2, h3, h4";
    $('#content').find(queryString).each(function(i, el) {
        var newLevel = parseInt(el.tagName.charAt(1), 10);
        hLevel = hLevel || newLevel;
        if (el.className === "notoc") {
            return
        }
        if (newLevel > hLevel) {
            hLevel = newLevel;
            var newList = $('<ol></ol>');
            lists[newLevel] = newList;
            currentList.append(newList);
            currentList = newList
        } else if (newLevel < hLevel) {
            hLevel = newLevel;
            currentList = lists[newLevel] || lists.root
        }
        var h = $(el);
        var hText = $.trim(h.find('a').text()) || h.text();
        var li = $('<li><a>' + hText + '</a></li>');
        var hId = h.attr('id') || 'toc-' + i;
        var urlWithoutHash = location.protocol + '//' + location.host + location.pathname;
        li.find('a').attr('href', urlWithoutHash + '#' + hId);
        currentList.append(li);
        h.attr('id', hId)
    });
    var $toc_children = lists.root.children();
    var $first_child = $toc_children.eq(0);
    if ($first_child.is('ol') && !$first_child.children().length) {
        $toc_children = $toc_children.slice(1, $toc_children.length);
        $toc_children.appendTo($first_child);
        lists.root.empty();
        $first_child.appendTo(lists.root)
    }
    if (!$first_child.is('ol')) {
        $toc_children.wrapAll('<ol />')
    }
    lists.root.appendTo(toc);
    toc.show()
}
jQuery(document).ready(function($) {
    var $document_toc = $('#document-toc');
    if ($document_toc.length) {
        build_toc($document_toc);
        var $portlet_header = $document_toc.find('.portletHeader');
        $portlet_header.click(function() {
            $document_toc.toggleClass('collapsed')
        })
    }
});

/* - eea-fullscreen.js - */
// http://www.eea.europa.eu/portal_javascripts/eea-fullscreen.js?original=1
jQuery(document).ready(function($) {});

/* - eea-tabs.js - */
// http://www.eea.europa.eu/portal_javascripts/eea-tabs.js?original=1
jQuery(document).ready(function($) {
    var eea_tabs = function() {
        if ($("#whatsnew-gallery").length) {
            return
        }
        var $eea_tabs = $(".eea-tabs"),
            eea_tabs_length = $eea_tabs.length,
            $eea_tabs_panels = $(".eea-tabs-panels"),
            i = 0;
        var $eea_tab, $eea_tabs_panel, $eea_panels, $eea_tab_children;
        if (eea_tabs_length) {
            for (i; i < eea_tabs_length; i += 1) {
                $eea_tab = $eea_tabs.eq(i);
                $eea_tab.detach();
                $eea_tabs_panel = $eea_tabs_panels.eq(i);
                $eea_panels = $eea_tabs_panel.children();
                $eea_panels.find('.eea-tabs-title').detach().appendTo($eea_tab);
                $eea_tab_children = $eea_tab.children();
                var j = 0,
                    tabs_length = $eea_tab_children.length,
                    $tab_title, tab_title_text;
                for (j; j < tabs_length; j += 1) {
                    $tab_title = $($eea_tab_children[j]);
                    if ($tab_title[0].tagName === "P") {
                        $tab_title.replaceWith("<li>" + $tab_title.html() + "</li>")
                    }
                    if (!$tab_title.find('a').length) {
                        tab_title_text = $tab_title.text();
                        $tab_title.text("");
                        $('<a />').attr('href', '#').html(tab_title_text).appendTo($tab_title)
                    }
                }
                $eea_tab_children = $eea_tab.children();
                $eea_tab.tabs($eea_panels);
                $eea_tab.insertBefore($eea_tabs_panel);
                var k = 1,
                    first_tab = $eea_tab_children[0],
                    first_tab_height, cur_tab;
                if (first_tab) {
                    first_tab_height = first_tab.clientHeight;
                    for (k; k < tabs_length; k += 1) {
                        cur_tab = $eea_tab_children[k];
                        if (cur_tab.clientHeight < first_tab_height) {
                            first_tab.style.maxWidth = "152px"
                        } else if (cur_tab.clientHeight > first_tab_height) {
                            cur_tab.style.maxWidth = "130px"
                        }
                    }
                }
            }
        }
    };
    window.EEA = window.EEA || {};
    window.EEA.eea_tabs = eea_tabs;
    eea_tabs()
});

/* - pagination.js - */
// http://www.eea.europa.eu/portal_javascripts/pagination.js?original=1
(function($) {
    $.PaginationCalculator = function(maxentries, opts) {
        this.maxentries = maxentries;
        this.opts = opts
    };
    $.extend($.PaginationCalculator.prototype, {
        numPages: function() {
            return Math.ceil(this.maxentries / this.opts.items_per_page)
        },
        getInterval: function(current_page) {
            var ne_half = Math.floor(this.opts.num_display_entries / 2);
            var np = this.numPages();
            var upper_limit = np - this.opts.num_display_entries;
            var start = current_page > ne_half ? Math.max(Math.min(current_page - ne_half, upper_limit), 0) : 0;
            var end = current_page > ne_half ? Math.min(current_page + ne_half + (this.opts.num_display_entries % 2), np) : Math.min(this.opts.num_display_entries, np);
            return {
                start: start,
                end: end
            }
        }
    });
    $.PaginationRenderers = {};
    $.PaginationRenderers.defaultRenderer = function(maxentries, opts) {
        this.maxentries = maxentries;
        this.opts = opts;
        this.pc = new $.PaginationCalculator(maxentries, opts)
    };
    $.extend($.PaginationRenderers.defaultRenderer.prototype, {
        createLink: function(page_id, current_page, appendopts) {
            var lnk, np = this.pc.numPages();
            page_id = page_id < 0 ? 0 : (page_id < np ? page_id : np - 1);
            appendopts = $.extend({
                text: page_id + 1,
                classes: ""
            }, appendopts || {});
            if (page_id == current_page) {
                lnk = $("<span class='current'>" + appendopts.text + "</span>")
            } else {
                lnk = $("<a>" + appendopts.text + "</a>").attr('href', this.opts.link_to.replace(/__id__/, page_id))
            }
            if (appendopts.classes) {
                lnk.addClass(appendopts.classes)
            }
            lnk.data('page_id', page_id);
            return lnk
        },
        appendRange: function(container, current_page, start, end, opts) {
            var i;
            for (i = start; i < end; i++) {
                this.createLink(i, current_page, opts).appendTo(container)
            }
        },
        getLinks: function(current_page, eventHandler) {
            var begin, end, interval = this.pc.getInterval(current_page),
                np = this.pc.numPages(),
                fragment = $("<div class='pagination'></div>");
            if (this.opts.prev_text && (current_page > 0 || this.opts.prev_show_always)) {
                fragment.append(this.createLink(current_page - 1, current_page, {
                    text: "« " + this.opts.prev_text + " " + this.opts.items_per_page + " " + this.opts.items_text,
                    classes: "listingPrevious"
                }))
            }
            if (interval.start > 0 && this.opts.num_edge_entries > 0) {
                end = Math.min(this.opts.num_edge_entries, interval.start);
                this.appendRange(fragment, current_page, 0, end, {
                    classes: 'sp'
                });
                if (this.opts.num_edge_entries < interval.start && this.opts.ellipse_text) {
                    $("<span>" + this.opts.ellipse_text + "</span>").appendTo(fragment)
                }
            }
            this.appendRange(fragment, current_page, interval.start, interval.end);
            if (interval.end < np && this.opts.num_edge_entries > 0) {
                if (np - this.opts.num_edge_entries > interval.end && this.opts.ellipse_text) {
                    $("<span>" + this.opts.ellipse_text + "</span>").appendTo(fragment)
                }
                begin = Math.max(np - this.opts.num_edge_entries, interval.end);
                this.appendRange(fragment, current_page, begin, np, {
                    classes: 'ep'
                })
            }
            if (this.opts.next_text && (current_page < np - 1 || this.opts.next_show_always)) {
                fragment.append(this.createLink(current_page + 1, current_page, {
                    text: this.opts.next_text + " " + this.opts.items_per_page + " " + this.opts.items_text + " »",
                    classes: "next"
                }))
            }
            $('a', fragment).click(eventHandler);
            return fragment
        }
    });
    $.fn.pagination = function(maxentries, opts) {
        opts = $.extend({
            items_per_page: 10,
            num_display_entries: 4,
            current_page: 0,
            num_edge_entries: 1,
            link_to: "#",
            prev_text: 'previous',
            next_text: 'next',
            items_text: 'items',
            ellipse_text: "...",
            prev_show_always: false,
            next_show_always: false,
            renderer: "defaultRenderer",
            show_if_single_page: false,
            load_first_page: true,
            callback: function() {
                return false
            }
        }, opts || {});
        var containers = this,
            renderer, links, current_page;

        function paginationClickHandler(evt) {
            var new_current_page = $(evt.target).data('page_id'),
                continuePropagation = selectPage(new_current_page);
            if (!continuePropagation) {
                evt.stopPropagation()
            }
            return continuePropagation
        }

        function selectPage(new_current_page) {
            containers.data('current_page', new_current_page);
            links = renderer.getLinks(new_current_page, paginationClickHandler);
            containers.empty();
            links.appendTo(containers);
            return opts.callback(new_current_page, containers)
        }
        current_page = parseInt(opts.current_page, 10);
        containers.data('current_page', current_page);
        maxentries = (!maxentries || maxentries < 0) ? 1 : maxentries;
        opts.items_per_page = (!opts.items_per_page || opts.items_per_page < 0) ? 1 : opts.items_per_page;
        if (!$.PaginationRenderers[opts.renderer]) {
            throw new ReferenceError("Pagination renderer '" + opts.renderer + "' was not found in jQuery.PaginationRenderers object.")
        }
        renderer = new $.PaginationRenderers[opts.renderer](maxentries, opts);
        var pc = new $.PaginationCalculator(maxentries, opts);
        var np = pc.numPages();
        containers.bind('setPage', {
            numPages: np
        }, function(evt, page_id) {
            if (page_id >= 0 && page_id < evt.data.numPages) {
                selectPage(page_id)
            }
            return false
        });
        containers.bind('prevPage', function() {
            var current_page = $(this).data('current_page');
            if (current_page > 0) {
                selectPage(current_page - 1)
            }
            return false
        });
        containers.bind('nextPage', {
            numPages: np
        }, function(evt) {
            var current_page = $(this).data('current_page');
            if (current_page < evt.data.numPages - 1) {
                selectPage(current_page + 1)
            }
            return false
        });
        links = renderer.getLinks(current_page, paginationClickHandler);
        containers.empty();
        if (np > 1 || opts.show_if_single_page) {
            links.appendTo(containers)
        }
        if (opts.load_first_page) {
            opts.callback(current_page, containers)
        }
    }
}(jQuery));

/* - eea-pagination.js - */
// http://www.eea.europa.eu/portal_javascripts/eea-pagination.js?original=1
jQuery(document).ready(function($) {
    var $related_items = $("#relatedItems"),
        has_related_items = $related_items.length && $related_items[0].tagName !== 'SELECT',
        $eea_tabs = $("#eea-tabs"),
        $paginate = $(".paginate"),
        $eea_tabs_panels = $("#eea-tabs-panels"),
        pagination_count = 12;
    $.merge($paginate, $related_items.find('.visualNoMarker')).each(function() {
        var $self = $(this),
            $children = $self.children(),
            count = 0,
            isPaginate = $self.hasClass('paginate');
        pagination_count = window.parseInt($self.attr('data-paginate-count'), 10) || pagination_count;
        $children = isPaginate && $children[0].tagName !== "H3" ? $self : $children;
        $children.each(function() {
            var items;
            var orig_entries;
            var num_entries;
            var $childes;
            var $this = $(this);
            var keepData = true;
            var scripts = $this.find('script');
            if (this.tagName === "H3") {
                $eea_tabs = !$eea_tabs.length ? $("<ul class='eea-tabs two-rows' />").insertBefore($self) : $eea_tabs;
                $eea_tabs_panels = !$eea_tabs_panels.length ? $("<div class='eea-tabs-panels' />").insertAfter($eea_tabs) : $eea_tabs_panels;
                $('<li><a href="#" /></li>').children().html($this.detach().html()).end().appendTo($eea_tabs)
            } else {
                $this.data($self.data());
                if (scripts.length) {
                    scripts.remove(undefined, keepData)
                }
                $childes = $this.children();
                num_entries = $childes.length;
                orig_entries = num_entries;
                while (num_entries > 0) {
                    count += 1;
                    items = $childes.slice(0, num_entries > pagination_count ? pagination_count : num_entries);
                    $('<div />', {
                        'class': "page",
                        'data-count': num_entries > pagination_count ? pagination_count : num_entries
                    }).append(items).appendTo($this);
                    $childes = $childes.not(items);
                    num_entries = $childes.length
                }
                $this.addClass('eea-tabs-panel').appendTo($eea_tabs_panels);
                if (orig_entries > pagination_count) {
                    $("<div class='paginator listingBar' />").prependTo($this).pagination(orig_entries, {
                        items_per_page: pagination_count,
                        next_text: $("#eeaPaginationNext").text(),
                        prev_text: $("#eeaPaginationPrev").text(),
                        item_text: $("#eeaPaginationItems").text(),
                        callback: function(idx, el) {
                            var $parent = el.parent(),
                                $page = $parent.find('.page').hide().eq(idx),
                                page_count = $page.next().data('count'),
                                next_item = $parent.find('.next')[0];
                            if (next_item) {
                                next_item.innerHTML = next_item.innerHTML.replace(pagination_count, page_count)
                            }
                            $page.show();
                            return false
                        }
                    })
                }
            }
        });
        if (isPaginate) {
            $eea_tabs = "";
            $eea_tabs_panels = ""
        }
    });
    if (has_related_items || $paginate.length) {
        window.EEA.eea_tabs()
    }
});

/* - slide.js - */
// http://www.eea.europa.eu/portal_javascripts/slide.js?original=1
(function($) {
    var langregex1 = new RegExp("(http://[a-z0-9.:]*)/(aa|ab|af|am|ar|as|ay|az|ba|be|bg|bh|bi|bn|bo|bs|br|ca|ch|co|cs|cy|da|de|dz|el|en|eo|es|et|eu|fa|fi|fj|fo|fr|fy|ga|gd|gl|gn|gu|gv|ha|he|hi|hr|hu|hy|ia|id|ie|ik|is|it|iu|ja|jbo|jw|ka|kk|kl|km|kn|ko|ks|ku|kw|ky|la|lb|li|ln|lo|lt|lv|mg|mi|mk|ml|mn|mo|mr|ms|mt|my|na|ne|nl|no|nn|oc|om|or|pa|pl|ps|pt|qu|rm|rn|ro|ru|rw|sa|sd|se|sg|sh|si|sk|sl|sm|sn|so|sq|sr|ss|st|su|sv|sw|ta|te|tg|th|ti|tk|tl|tn|to|tr|ts|tt|tw|ug|uk|ur|uz|vi|vo|wa|wo|xh|yi|yo|za|zh|zu)/.*");
    var langregex2 = new RegExp("(http://[a-z0-9.:]*/)(aa|ab|af|am|ar|as|ay|az|ba|be|bg|bh|bi|bn|bo|bs|br|ca|ch|co|cs|cy|da|de|dz|el|en|eo|es|et|eu|fa|fi|fj|fo|fr|fy|ga|gd|gl|gn|gu|gv|ha|he|hi|hr|hu|hy|ia|id|ie|ik|is|it|iu|ja|jbo|jw|ka|kk|kl|km|kn|ko|ks|ku|kw|ky|la|lb|li|ln|lo|lt|lv|mg|mi|mk|ml|mn|mo|mr|ms|mt|my|na|ne|nl|no|nn|oc|om|or|pa|pl|ps|pt|qu|rm|rn|ro|ru|rw|sa|sd|se|sg|sh|si|sk|sl|sm|sn|so|sq|sr|ss|st|su|sv|sw|ta|te|tg|th|ti|tk|tl|tn|to|tr|ts|tt|tw|ug|uk|ur|uz|vi|vo|wa|wo|xh|yi|yo|za|zh|zu)$");

    function isCurrentPageTranslated() {
        var link = document.location.href.toLowerCase();
        return langregex1.test(link) || langregex2.test(link)
    }
    $(document).ready(function() {
        function panel(i) {
            var a = $(this);
            var buttonID = a.parent().attr('id');
            var tooltip = $('#tip-' + buttonID);
            if (buttonID === "siteaction-contactus" && isCurrentPageTranslated()) {
                return
            }
            var article_lang = buttonID === "article-language";
            var networks_panel = buttonID === "externalsites-networks";
            if (tooltip.length > 0) {
                a.attr("title", "").attr("href", "#");
                fordef = 'click, blur';
                a.tooltip({
                    tip: tooltip[0],
                    position: 'bottom center',
                    offset: [0, 0],
                    delay: 10000000,
                    events: {
                        def: fordef
                    }
                });
                a.click(function(ev) {
                    ev.preventDefault();
                    var parents = $('#cross-site-top, #content'),
                        panels = parents.find('.panel');
                    panels.each(function() {
                        var $this = $(this);
                        var $id = $this.attr('id');
                        if ($id !== "" && $id !== tooltip.attr('id')) {
                            $this.fadeOut('fast')
                        }
                    });
                    if (article_lang) {
                        $("#tip-article-language").css({
                            position: 'absolute',
                            top: '48px',
                            display: 'block',
                            right: '0px',
                            left: ''
                        })
                    }
                    if (networks_panel) {
                        $("#tip-externalsites-networks").css('margin-left', '2em')
                    }
                    tooltip.fadeIn('fast')
                })
            }
        }
        var parents = $('#cross-site-top, #content'),
            panels = parents.find('.panel').filter(function() {
                return this.id !== ""
            });
        $(document).click(function(e) {
            var target = $(e.target);
            if (!target.is('#cross-site-top a,  #cross-site-top .panel, #article-language a') && !target.parents('.panel').length) {
                panels.fadeOut('fast')
            }
        });
        $("#portal-siteactions a").each(panel);
        $("#portal-externalsites a").each(panel);
        $("#article-language").find('a').each(panel);
        $("#tip-externalsites-networks").find(".externalsites a").each(panel);
        var footer = $("#tip-siteaction-events .portletFooter");
        var submitLink = $("#tip-siteaction-events #submit-event-link");
        submitLink.remove().css('margin-right', '0.5em');
        footer.prepend(submitLink)
    })
}(jQuery));

/* - soer_frontpage.js - */
// http://www.eea.europa.eu/portal_javascripts/soer_frontpage.js?original=1
(function($) {
    $(document).ready(function() {
        var slide_portlet = $('.slidePortlet');
        if (slide_portlet.length === 0) {
            return
        }
        var body = $('body'),
            body_class = body.attr('class').match(/\bsoer/);
        slide_portlet.each(function() {
            var portlet = $(this);
            var b1 = $('<span class="slideButton next"></span>');
            var b2 = $('<span class="slideButton prev"></span>');
            portlet.append(b1);
            portlet.append(b2);
            var play = $('<div class="slideButton play"></div>');
            portlet.append(play);
            var items = portlet.find('.portletItem');
            var randomnumber = Math.floor(Math.random() * items.length);
            var elem = items[randomnumber];
            $(elem).addClass('selected');
            $(elem).css('left', 0);
            b1.click(function() {
                var current = portlet.find('.portletItem.selected');
                var next = current.next('.portletItem');
                var currentIndex = portlet.find('.portletItem').index(current);
                var nextIndex = portlet.find('.portletItem').index(next);
                if (currentIndex + 1 == portlet.find('.portletItem').length) {
                    return
                }
                current.removeClass('selected');
                next.addClass('selected');
                current.animate({
                    'left': -(portlet.width() + 100)
                });
                next.animate({
                    'left': 0
                })
            });
            b2.click(function() {
                var current = portlet.find('.portletItem.selected');
                var next = current.prev('.portletItem');
                var currentIndex = portlet.find('.portletItem').index(current);
                var nextIndex = portlet.find('.portletItem').index(next);
                if (currentIndex === 0) {
                    return
                }
                current.removeClass('selected');
                next.addClass('selected');
                var p = portlet.width() + 100;
                current.animate({
                    'left': portlet.width() + 100
                });
                next.animate({
                    'left': 0
                })
            });
            var playID;
            play.click(function() {
                var $this = $(this);
                if ($this.hasClass('pause')) {
                    $this.removeClass('pause');
                    window.clearInterval(playID)
                } else {
                    $this.toggleClass('pause');
                    b1.click();
                    playID = window.setInterval(function() {
                        b1.click()
                    }, 10000)
                }
            });
            if (body_class) {
                play.addClass('pause');
                playID = window.setInterval(function() {
                    b1.click()
                }, 10000)
            }
        })
    })
})(jQuery);

/* - ++resource++flowplayer-html/flowplayer-3.2.2.min.js - */
// http://www.eea.europa.eu/portal_javascripts/++resource++flowplayer-html/flowplayer-3.2.2.min.js?original=1
(function() {
    function g(o) {
        console.log("$f.fireEvent", [].slice.call(o))
    }
    function k(q) {
        if (!q || typeof q != "object") {
            return q
        }
        var o = new q.constructor();
        for (var p in q) {
            if (q.hasOwnProperty(p)) {
                o[p] = k(q[p])
            }
        }
        return o
    }
    function m(t, q) {
        if (!t) {
            return
        }
        var o, p = 0,
            r = t.length;
        if (r === undefined) {
            for (o in t) {
                if (q.call(t[o], o, t[o]) === false) {
                    break
                }
            }
        } else {
            for (var s = t[0]; p < r && q.call(s, p, s) !== false; s = t[++p]) {}
        }
        return t
    }
    function c(o) {
        return document.getElementById(o)
    }
    function i(q, p, o) {
        if (typeof p != "object") {
            return q
        }
        if (q && p) {
            m(p, function(r, s) {
                if (!o || typeof s != "function") {
                    q[r] = s
                }
            })
        }
        return q
    }
    function n(s) {
        var q = s.indexOf(".");
        if (q != -1) {
            var p = s.slice(0, q) || "*";
            var o = s.slice(q + 1, s.length);
            var r = [];
            m(document.getElementsByTagName(p), function() {
                if (this.className && this.className.indexOf(o) != -1) {
                    r.push(this)
                }
            });
            return r
        }
    }
    function f(o) {
        o = o || window.event;
        if (o.preventDefault) {
            o.stopPropagation();
            o.preventDefault()
        } else {
            o.returnValue = false;
            o.cancelBubble = true
        }
        return false
    }
    function j(q, o, p) {
        q[o] = q[o] || [];
        q[o].push(p)
    }
    function e() {
        return "_" + ("" + Math.random()).slice(2, 10)
    }
    var h = function(t, r, s) {
        var q = this,
            p = {}, u = {};
        q.index = r;
        if (typeof t == "string") {
            t = {
                url: t
            }
        }
        i(this, t, true);
        m(("Begin*,Start,Pause*,Resume*,Seek*,Stop*,Finish*,LastSecond,Update,BufferFull,BufferEmpty,BufferStop").split(","), function() {
            var v = "on" + this;
            if (v.indexOf("*") != -1) {
                v = v.slice(0, v.length - 1);
                var w = "onBefore" + v.slice(2);
                q[w] = function(x) {
                    j(u, w, x);
                    return q
                }
            }
            q[v] = function(x) {
                j(u, v, x);
                return q
            };
            if (r == -1) {
                if (q[w]) {
                    s[w] = q[w]
                }
                if (q[v]) {
                    s[v] = q[v]
                }
            }
        });
        i(this, {
            onCuepoint: function(x, w) {
                if (arguments.length == 1) {
                    p.embedded = [null, x];
                    return q
                }
                if (typeof x == "number") {
                    x = [x]
                }
                var v = e();
                p[v] = [x, w];
                if (s.isLoaded()) {
                    s._api().fp_addCuepoints(x, r, v)
                }
                return q
            },
            update: function(w) {
                i(q, w);
                if (s.isLoaded()) {
                    s._api().fp_updateClip(w, r)
                }
                var v = s.getConfig();
                var x = (r == -1) ? v.clip : v.playlist[r];
                i(x, w, true)
            },
            _fireEvent: function(v, y, w, A) {
                if (v == "onLoad") {
                    m(p, function(B, C) {
                        if (C[0]) {
                            s._api().fp_addCuepoints(C[0], r, B)
                        }
                    });
                    return false
                }
                A = A || q;
                if (v == "onCuepoint") {
                    var z = p[y];
                    if (z) {
                        return z[1].call(s, A, w)
                    }
                }
                if (y && "onBeforeBegin,onMetaData,onStart,onUpdate,onResume".indexOf(v) != -1) {
                    i(A, y);
                    if (y.metaData) {
                        if (!A.duration) {
                            A.duration = y.metaData.duration
                        } else {
                            A.fullDuration = y.metaData.duration
                        }
                    }
                }
                var x = true;
                m(u[v], function() {
                    x = this.call(s, A, y, w)
                });
                return x
            }
        });
        if (t.onCuepoint) {
            var o = t.onCuepoint;
            q.onCuepoint.apply(q, typeof o == "function" ? [o] : o);
            delete t.onCuepoint
        }
        m(t, function(v, w) {
            if (typeof w == "function") {
                j(u, v, w);
                delete t[v]
            }
        });
        if (r == -1) {
            s.onCuepoint = this.onCuepoint
        }
    };
    var l = function(p, r, q, t) {
        var o = this,
            s = {}, u = false;
        if (t) {
            i(s, t)
        }
        m(r, function(v, w) {
            if (typeof w == "function") {
                s[v] = w;
                delete r[v]
            }
        });
        i(this, {
            animate: function(y, z, x) {
                if (!y) {
                    return o
                }
                if (typeof z == "function") {
                    x = z;
                    z = 500
                }
                if (typeof y == "string") {
                    var w = y;
                    y = {};
                    y[w] = z;
                    z = 500
                }
                if (x) {
                    var v = e();
                    s[v] = x
                }
                if (z === undefined) {
                    z = 500
                }
                r = q._api().fp_animate(p, y, z, v);
                return o
            },
            css: function(w, x) {
                if (x !== undefined) {
                    var v = {};
                    v[w] = x;
                    w = v
                }
                r = q._api().fp_css(p, w);
                i(o, r);
                return o
            },
            show: function() {
                this.display = "block";
                q._api().fp_showPlugin(p);
                return o
            },
            hide: function() {
                this.display = "none";
                q._api().fp_hidePlugin(p);
                return o
            },
            toggle: function() {
                this.display = q._api().fp_togglePlugin(p);
                return o
            },
            fadeTo: function(y, x, w) {
                if (typeof x == "function") {
                    w = x;
                    x = 500
                }
                if (w) {
                    var v = e();
                    s[v] = w
                }
                this.display = q._api().fp_fadeTo(p, y, x, v);
                this.opacity = y;
                return o
            },
            fadeIn: function(w, v) {
                return o.fadeTo(1, w, v)
            },
            fadeOut: function(w, v) {
                return o.fadeTo(0, w, v)
            },
            getName: function() {
                return p
            },
            getPlayer: function() {
                return q
            },
            _fireEvent: function(w, v, x) {
                if (w == "onUpdate") {
                    var z = q._api().fp_getPlugin(p);
                    if (!z) {
                        return
                    }
                    i(o, z);
                    delete o.methods;
                    if (!u) {
                        m(z.methods, function() {
                            var B = "" + this;
                            o[B] = function() {
                                var C = [].slice.call(arguments);
                                var D = q._api().fp_invoke(p, B, C);
                                return D === "undefined" || D === undefined ? o : D
                            }
                        });
                        u = true
                    }
                }
                var A = s[w];
                if (A) {
                    var y = A.apply(o, v);
                    if (w.slice(0, 1) == "_") {
                        delete s[w]
                    }
                    return y
                }
                return o
            }
        })
    };

    function b(q, G, t) {
        var w = this,
            v = null,
            D = false,
            u, s, F = [],
            y = {}, x = {}, E, r, p, C, o, A;
        i(w, {
            id: function() {
                return E
            },
            isLoaded: function() {
                return (v !== null && v.fp_play != undefined && !D)
            },
            getParent: function() {
                return q
            },
            hide: function(H) {
                if (H) {
                    q.style.height = "0px"
                }
                if (w.isLoaded()) {
                    v.style.height = "0px"
                }
                return w
            },
            show: function() {
                q.style.height = A + "px";
                if (w.isLoaded()) {
                    v.style.height = o + "px"
                }
                return w
            },
            isHidden: function() {
                return w.isLoaded() && parseInt(v.style.height, 10) === 0
            },
            load: function(J) {
                if (!w.isLoaded() && w._fireEvent("onBeforeLoad") !== false) {
                    var H = function() {
                        u = q.innerHTML;
                        if (u && !flashembed.isSupported(G.version)) {
                            q.innerHTML = ""
                        }
                        flashembed(q, G, {
                            config: t
                        });
                        if (J) {
                            J.cached = true;
                            j(x, "onLoad", J)
                        }
                    };
                    var I = 0;
                    m(a, function() {
                        this.unload(function(K) {
                            if (++I == a.length) {
                                H()
                            }
                        })
                    })
                }
                return w
            },
            unload: function(J) {
                if (this.isFullscreen() && /WebKit/i.test(navigator.userAgent)) {
                    if (J) {
                        J(false)
                    }
                    return w
                }
                if (u.replace(/\s/g, "") !== "") {
                    if (w._fireEvent("onBeforeUnload") === false) {
                        if (J) {
                            J(false)
                        }
                        return w
                    }
                    D = true;
                    try {
                        if (v) {
                            v.fp_close();
                            w._fireEvent("onUnload")
                        }
                    } catch (H) {}
                    var I = function() {
                        v = null;
                        q.innerHTML = u;
                        D = false;
                        if (J) {
                            J(true)
                        }
                    };
                    setTimeout(I, 50)
                } else {
                    if (J) {
                        J(false)
                    }
                }
                return w
            },
            getClip: function(H) {
                if (H === undefined) {
                    H = C
                }
                return F[H]
            },
            getCommonClip: function() {
                return s
            },
            getPlaylist: function() {
                return F
            },
            getPlugin: function(H) {
                var J = y[H];
                if (!J && w.isLoaded()) {
                    var I = w._api().fp_getPlugin(H);
                    if (I) {
                        J = new l(H, I, w);
                        y[H] = J
                    }
                }
                return J
            },
            getScreen: function() {
                return w.getPlugin("screen")
            },
            getControls: function() {
                return w.getPlugin("controls")._fireEvent("onUpdate")
            },
            getLogo: function() {
                try {
                    return w.getPlugin("logo")._fireEvent("onUpdate")
                } catch (H) {}
            },
            getPlay: function() {
                return w.getPlugin("play")._fireEvent("onUpdate")
            },
            getConfig: function(H) {
                return H ? k(t) : t
            },
            getFlashParams: function() {
                return G
            },
            loadPlugin: function(K, J, M, L) {
                if (typeof M == "function") {
                    L = M;
                    M = {}
                }
                var I = L ? e() : "_";
                w._api().fp_loadPlugin(K, J, M, I);
                var H = {};
                H[I] = L;
                var N = new l(K, null, w, H);
                y[K] = N;
                return N
            },
            getState: function() {
                return w.isLoaded() ? v.fp_getState() : -1
            },
            play: function(I, H) {
                var J = function() {
                    if (I !== undefined) {
                        w._api().fp_play(I, H)
                    } else {
                        w._api().fp_play()
                    }
                };
                if (w.isLoaded()) {
                    J()
                } else {
                    if (D) {
                        setTimeout(function() {
                            w.play(I, H)
                        }, 50)
                    } else {
                        w.load(function() {
                            J()
                        })
                    }
                }
                return w
            },
            getVersion: function() {
                var I = "flowplayer.js 3.2.0";
                if (w.isLoaded()) {
                    var H = v.fp_getVersion();
                    H.push(I);
                    return H
                }
                return I
            },
            _api: function() {
                if (!w.isLoaded()) {
                    throw "Flowplayer " + w.id() + " not loaded when calling an API method"
                }
                return v
            },
            setClip: function(H) {
                w.setPlaylist([H]);
                return w
            },
            getIndex: function() {
                return p
            }
        });
        m(("Click*,Load*,Unload*,Keypress*,Volume*,Mute*,Unmute*,PlaylistReplace,ClipAdd,Fullscreen*,FullscreenExit,Error,MouseOver,MouseOut").split(","), function() {
            var H = "on" + this;
            if (H.indexOf("*") != -1) {
                H = H.slice(0, H.length - 1);
                var I = "onBefore" + H.slice(2);
                w[I] = function(J) {
                    j(x, I, J);
                    return w
                }
            }
            w[H] = function(J) {
                j(x, H, J);
                return w
            }
        });
        m(("pause,resume,mute,unmute,stop,toggle,seek,getStatus,getVolume,setVolume,getTime,isPaused,isPlaying,startBuffering,stopBuffering,isFullscreen,toggleFullscreen,reset,close,setPlaylist,addClip,playFeed,setKeyboardShortcutsEnabled,isKeyboardShortcutsEnabled").split(","), function() {
            var H = this;
            w[H] = function(J, I) {
                if (!w.isLoaded()) {
                    return w
                }
                var K = null;
                if (J !== undefined && I !== undefined) {
                    K = v["fp_" + H](J, I)
                } else {
                    K = (J === undefined) ? v["fp_" + H]() : v["fp_" + H](J)
                }
                return K === "undefined" || K === undefined ? w : K
            }
        });
        w._fireEvent = function(Q) {
            if (typeof Q == "string") {
                Q = [Q]
            }
            var R = Q[0],
                O = Q[1],
                M = Q[2],
                L = Q[3],
                K = 0;
            if (t.debug) {
                g(Q)
            }
            if (!w.isLoaded() && R == "onLoad" && O == "player") {
                v = v || c(r);
                o = v.clientHeight;
                m(F, function() {
                    this._fireEvent("onLoad")
                });
                m(y, function(S, T) {
                    T._fireEvent("onUpdate")
                });
                s._fireEvent("onLoad")
            }
            if (R == "onLoad" && O != "player") {
                return
            }
            if (R == "onError") {
                if (typeof O == "string" || (typeof O == "number" && typeof M == "number")) {
                    O = M;
                    M = L
                }
            }
            if (R == "onContextMenu") {
                m(t.contextMenu[O], function(S, T) {
                    T.call(w)
                });
                return
            }
            if (R == "onPluginEvent" || R == "onBeforePluginEvent") {
                var H = O.name || O;
                var I = y[H];
                if (I) {
                    I._fireEvent("onUpdate", O);
                    return I._fireEvent(M, Q.slice(3))
                }
                return
            }
            if (R == "onPlaylistReplace") {
                F = [];
                var N = 0;
                m(O, function() {
                    F.push(new h(this, N++, w))
                })
            }
            if (R == "onClipAdd") {
                if (O.isInStream) {
                    return
                }
                O = new h(O, M, w);
                F.splice(M, 0, O);
                for (K = M + 1; K < F.length; K++) {
                    F[K].index++
                }
            }
            var P = true;
            if (typeof O == "number" && O < F.length) {
                C = O;
                var J = F[O];
                if (J) {
                    P = J._fireEvent(R, M, L)
                }
                if (!J || P !== false) {
                    P = s._fireEvent(R, M, L, J)
                }
            }
            m(x[R], function() {
                P = this.call(w, O, M);
                if (this.cached) {
                    x[R].splice(K, 1)
                }
                if (P === false) {
                    return false
                }
                K++
            });
            return P
        };

        function B() {
            if ($f(q)) {
                $f(q).getParent().innerHTML = "";
                p = $f(q).getIndex();
                a[p] = w
            } else {
                a.push(w);
                p = a.length - 1
            }
            A = parseInt(q.style.height, 10) || q.clientHeight;
            E = q.id || "fp" + e();
            r = G.id || E + "_api";
            G.id = r;
            t.playerId = E;
            if (typeof t == "string") {
                t = {
                    clip: {
                        url: t
                    }
                }
            }
            if (typeof t.clip == "string") {
                t.clip = {
                    url: t.clip
                }
            }
            t.clip = t.clip || {};
            if (q.getAttribute("href", 2) && !t.clip.url) {
                t.clip.url = q.getAttribute("href", 2)
            }
            s = new h(t.clip, - 1, w);
            t.playlist = t.playlist || [t.clip];
            var H = 0;
            m(t.playlist, function() {
                var J = this;
                if (typeof J == "object" && J.length) {
                    J = {
                        url: "" + J
                    }
                }
                m(t.clip, function(K, L) {
                    if (L !== undefined && J[K] === undefined && typeof L != "function") {
                        J[K] = L
                    }
                });
                t.playlist[H] = J;
                J = new h(J, H, w);
                F.push(J);
                H++
            });
            m(t, function(J, K) {
                if (typeof K == "function") {
                    if (s[J]) {
                        s[J](K)
                    } else {
                        j(x, J, K)
                    }
                    delete t[J]
                }
            });
            m(t.plugins, function(J, K) {
                if (K) {
                    y[J] = new l(J, K, w)
                }
            });
            if (!t.plugins || t.plugins.controls === undefined) {
                y.controls = new l("controls", null, w)
            }
            y.canvas = new l("canvas", null, w);

            function I(J) {
                if (!w.isLoaded() && w._fireEvent("onBeforeClick") !== false) {
                    w.load()
                }
                return f(J)
            }
            u = q.innerHTML;
            if (u.replace(/\s/g, "") !== "") {
                if (q.addEventListener) {
                    q.addEventListener("click", I, false)
                } else {
                    if (q.attachEvent) {
                        q.attachEvent("onclick", I)
                    }
                }
            } else {
                if (q.addEventListener) {
                    q.addEventListener("click", f, false)
                }
                w.load()
            }
        }
        if (typeof q == "string") {
            var z = c(q);
            if (!z) {
                throw "Flowplayer cannot access element: " + q
            } else {
                q = z;
                B()
            }
        } else {
            B()
        }
    }
    var a = [];

    function d(o) {
        this.length = o.length;
        this.each = function(p) {
            m(o, p)
        };
        this.size = function() {
            return o.length
        }
    }
    window.flowplayer = window.$f = function() {
        var p = null;
        var o = arguments[0];
        if (!arguments.length) {
            m(a, function() {
                if (this.isLoaded()) {
                    p = this;
                    return false
                }
            });
            return p || a[0]
        }
        if (arguments.length == 1) {
            if (typeof o == "number") {
                return a[o]
            } else {
                if (o == "*") {
                    return new d(a)
                }
                m(a, function() {
                    if (this.id() == o.id || this.id() == o || this.getParent() == o) {
                        p = this;
                        return false
                    }
                });
                return p
            }
        }
        if (arguments.length > 1) {
            var t = arguments[1],
                q = (arguments.length == 3) ? arguments[2] : {};
            if (typeof t == "string") {
                t = {
                    src: t
                }
            }
            t = i({
                bgcolor: "#000000",
                version: [9, 0],
                expressInstall: "http://static.flowplayer.org/swf/expressinstall.swf",
                cachebusting: true
            }, t);
            if (typeof o == "string") {
                if (o.indexOf(".") != -1) {
                    var s = [];
                    m(n(o), function() {
                        s.push(new b(this, k(t), k(q)))
                    });
                    return new d(s)
                } else {
                    var r = c(o);
                    return new b(r !== null ? r : o, t, q)
                }
            } else {
                if (o) {
                    return new b(o, t, q)
                }
            }
        }
        return null
    };
    i(window.$f, {
        fireEvent: function() {
            var o = [].slice.call(arguments);
            var q = $f(o[0]);
            return q ? q._fireEvent(o.slice(1)) : null
        },
        addPlugin: function(o, p) {
            b.prototype[o] = p;
            return $f
        },
        each: m,
        extend: i
    });
    if (typeof jQuery == "function") {
        jQuery.fn.flowplayer = function(q, p) {
            if (!arguments.length || typeof arguments[0] == "number") {
                var o = [];
                this.each(function() {
                    var r = $f(this);
                    if (r) {
                        o.push(r)
                    }
                });
                return arguments.length ? o[arguments[0]] : new d(o)
            }
            return this.each(function() {
                $f(this, k(q), p ? k(p) : {})
            })
        }
    }
})();
(function() {
    var h = document.all,
        j = "http://www.adobe.com/go/getflashplayer",
        c = typeof jQuery == "function",
        e = /(\d+)[^\d]+(\d+)[^\d]*(\d*)/,
        b = {
            width: "100%",
            height: "100%",
            id: "_" + ("" + Math.random()).slice(9),
            allowfullscreen: true,
            allowscriptaccess: "always",
            quality: "high",
            version: [3, 0],
            onFail: null,
            expressInstall: null,
            w3c: false,
            cachebusting: false
        };
    if (window.attachEvent) {
        window.attachEvent("onbeforeunload", function() {
            __flash_unloadHandler = function() {};
            __flash_savedUnloadHandler = function() {}
        })
    }
    function i(l, f) {
        if (f) {
            for (key in f) {
                if (f.hasOwnProperty(key)) {
                    l[key] = f[key]
                }
            }
        }
        return l
    }
    function a(f, n) {
        var m = [];
        for (var l in f) {
            if (f.hasOwnProperty(l)) {
                m[l] = n(f[l])
            }
        }
        return m
    }
    window.flashembed = function(f, m, l) {
        if (typeof f == "string") {
            f = document.getElementById(f.replace("#", ""))
        }
        if (!f) {
            return
        }
        if (typeof m == "string") {
            m = {
                src: m
            }
        }
        return new d(f, i(i({}, b), m), l)
    };
    var g = i(window.flashembed, {
        conf: b,
        getVersion: function() {
            var f;
            try {
                f = navigator.plugins["Shockwave Flash"].description.slice(16)
            } catch (n) {
                try {
                    var l = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");
                    f = l && l.GetVariable("$version")
                } catch (m) {}
            }
            f = e.exec(f);
            return f ? [f[1], f[3]] : [0, 0]
        },
        asString: function(l) {
            if (l === null || l === undefined) {
                return null
            }
            var f = typeof l;
            if (f == "object" && l.push) {
                f = "array"
            }
            switch (f) {
                case "string":
                    l = l.replace(new RegExp('(["\\\\])', "g"), "\\$1");
                    l = l.replace(/^\s?(\d+\.?\d+)%/, "$1pct");
                    return '"' + l + '"';
                case "array":
                    return "[" + a(l, function(o) {
                        return g.asString(o)
                    }).join(",") + "]";
                case "function":
                    return '"function()"';
                case "object":
                    var m = [];
                    for (var n in l) {
                        if (l.hasOwnProperty(n)) {
                            m.push('"' + n + '":' + g.asString(l[n]))
                        }
                    }
                    return "{" + m.join(",") + "}"
            }
            return String(l).replace(/\s/g, " ").replace(/\'/g, '"')
        },
        getHTML: function(o, l) {
            o = i({}, o);
            var n = '<object width="' + o.width + '" height="' + o.height + '" id="' + o.id + '" name="' + o.id + '"';
            if (o.cachebusting) {
                o.src += ((o.src.indexOf("?") != -1 ? "&" : "?") + Math.random())
            }
            if (o.w3c || !h) {
                n += ' data="' + o.src + '" type="application/x-shockwave-flash"'
            } else {
                n += ' classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"'
            }
            n += ">";
            if (o.w3c || h) {
                n += '<param name="movie" value="' + o.src + '" />'
            }
            o.width = o.height = o.id = o.w3c = o.src = null;
            o.onFail = o.version = o.expressInstall = null;
            for (var m in o) {
                if (o[m]) {
                    n += '<param name="' + m + '" value="' + o[m] + '" />'
                }
            }
            var p = "";
            if (l) {
                for (var f in l) {
                    if (l[f]) {
                        var q = l[f];
                        p += f + "=" + (/function|object/.test(typeof q) ? g.asString(q) : q) + "&"
                    }
                }
                p = p.slice(0, - 1);
                n += '<param name="flashvars" value=\'' + p + "' />"
            }
            n += "</object>";
            return n
        },
        isSupported: function(f) {
            return k[0] > f[0] || k[0] == f[0] && k[1] >= f[1]
        }
    });
    var k = g.getVersion();

    function d(f, n, m) {
        if (g.isSupported(n.version)) {
            f.innerHTML = g.getHTML(n, m)
        } else {
            if (n.expressInstall && g.isSupported([6, 65])) {
                f.innerHTML = g.getHTML(i(n, {
                    src: n.expressInstall
                }), {
                    MMredirectURL: location.href,
                    MMplayerType: "PlugIn",
                    MMdoctitle: document.title
                })
            } else {
                if (!f.innerHTML.replace(/\s/g, "")) {
                    f.innerHTML = "<h2>Flash version " + n.version + " or greater is required</h2><h3>" + (k[0] > 0 ? "Your version is " + k : "You have no flash plugin installed") + "</h3>" + (f.tagName == "A" ? "<p>Click here to download latest version</p>" : "<p>Download latest version from <a href='" + j + "'>here</a></p>");
                    if (f.tagName == "A") {
                        f.onclick = function() {
                            location.href = j
                        }
                    }
                }
                if (n.onFail) {
                    var l = n.onFail.call(this);
                    if (typeof l == "string") {
                        f.innerHTML = l
                    }
                }
            }
        }
        if (h) {
            window[n.id] = document.getElementById(n.id)
        }
        i(this, {
            getRoot: function() {
                return f
            },
            getOptions: function() {
                return n
            },
            getConf: function() {
                return m
            },
            getApi: function() {
                return f.firstChild
            }
        })
    }
    if (c) {
        jQuery.tools = jQuery.tools || {
            version: "3.2.0"
        };
        jQuery.tools.flashembed = {
            conf: b
        };
        jQuery.fn.flashembed = function(l, f) {
            return this.each(function() {
                jQuery(this).data("flashembed", flashembed(this, l, f))
            })
        }
    }
})();
