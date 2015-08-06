Ext.namespace('CB.browser.view');

Ext.define('CB.browser.view.ActivityStream',{
    extend: 'CB.browser.view.Interface'

    ,xtype: 'CBBrowserViewActivityStream'

    ,border: false
    ,tbarCssClass: 'x-panel-white'
    ,layout: 'fit'

    // ,scrollable: true

    ,initComponent: function(){

        var tpl = new Ext.XTemplate(
            '<table class="activity-stream" style="margin:0">'
            ,'<tpl for=".">'
            ,'<tr class="as-record">'
            ,'    <td class="as-item">'
            ,'        <table class="action">'
            ,'          <tr>'
            ,'            <td class="action-icon">{[this.getTitleIcon(values)]}</td>'
            ,'            <td class="action-title">{[this.getTitle(values)]}</td>'
            ,'          </tr>'
            ,'          <tr>'
            ,'            <td class="action-text" colspan="2">'
            ,'               <table>'
            ,'                  <tr>'
            ,'                    <td>{[this.getContent(values)]}</td>'
            ,'                 </tr>'
            ,'               </table>'
            ,'            </td>'
            ,'          </tr>'
            ,'        </table>'
            ,'        <div class="action-comments as-record-{nid}">'
            // ,'          <tr><td class="action-comment">Comment</td></tr>'
            // ,'          <tr><td class="action-comment">Add comment</td></tr>'
            ,'        </div>'
            ,'    </td>'
            ,'</tr>'
            ,'</tpl>'
            ,'</table>'
            ,{
                getTitleIcon: function(r){
                    var uid = r.lastAction.uids[0]
                        ,us = CB.DB.usersStore
                        ,rez = '<img class="i32" src="/' +
                            App.config.coreName + '/photo/' + uid + '.jpg?32=' +
                            us.getPhotoParam(uid)  + '" title="' +
                            us.getName(uid)
                            + '">';
                   return rez;
                }

                ,getTitle: function(r){
                    var rez = ''
                        ,la = r.lastAction
                        ,us = CB.DB.usersStore
                        ,users = [];
                    for (var i = 0; i < la.uids.length; i++) {
                        users.push(' <b>' + us.getName(la.uids[i]) + '</b> ');
                    }
                    clog(users, users.length);
                    switch(users.length) {
                        case 0:
                            break;
                        case 1:
                            rez += users[0];

                            break;
                        case 2:
                            rez += users[0] + L.and + users[1];

                            break;

                        case 3:
                            rez += users[0] + ', ' + users[1] + L.and + users[2];

                            break;

                        default:
                            rez += users[0] + ', ' + users[1] + L.and + ' ' + Ext.valueFrom(L.NNOthers, '{count} others').replace('{count}', users.length -1);
                    }

                    switch(la.type) {
                        case 'comment':
                            rez += ' ' + Ext.valueFrom(L[la.type + 'ed'], la.type);
                            break;
                        default:
                            rez += ' ' + Ext.valueFrom(L[la.type + 'd'], la.type);
                    }

                    rez += ' <a class="click open-obj" nid="' + r.nid + '">' + r.name + '</a>';

                    rez += ' <div class="as-ago-time">' + la.agoText + '</div>';

                    return rez;
                }

                ,getContent: function(r){
                   return r['diff'];
                }

            }
        );

        this.dataView = new Ext.DataView({
            tpl: tpl
            ,store: this.store
            ,deferInitialRefresh: true
            ,itemSelector:'tr.as-record'
            ,overItemCls:'as-record-over'
            ,scrollable: true
            ,listeners: {
                scope: this
                ,itemclick: this.onItemClick
                ,selectionchange: this.onSelectionChange
            }
        });

        Ext.apply(this, {
            title: L.ActivityStream
            ,viewName: 'activityStream'
            ,header: false
            ,items: [
                this.dataView
            ]
        });

        this.callParent(arguments);
    }

    ,updateToolbarButtons: function() {
        this.refOwner.fireEvent(
            'settoolbaritems'
            ,[
                'create'
                ,'upload'
                ,'download'
                ,'-'
                ,'edit'
                ,'delete'
                ,'->'
                ,'reload'
                ,'apps'
                ,'-'
                ,'more'
            ]
        );
    }

    ,onItemClick: function() {
        clog('itemclick', arguments);
    }

    ,onSelectionChange: function(view, selected, eOpts) {
        var recs = [];
        clog('selectionchange', arguments);
        for (var i = 0; i < selected.length; i++) {
            recs.push(selected[i].data);
        }
        this.fireEvent('selectionchange', recs);
    }
});
