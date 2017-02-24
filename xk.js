'use strict'

const DayTo = { "一":0, "二":1, "三":2, "四":3, "五":4, "六":5, "日":6 };

function addTimeSheet(a) {
    $("body").append("<table id='timesheet"+a+"'></table>")

    var term = a == 1 ? "春秋" : "冬夏";
    $("#timesheet"+a).append("<tr><th>"+term+"</th></tr>");

    for (let i = 1; i < 14; i++) {
        $("#timesheet"+a).append("<tr><th>" + i + "</th></tr>");
        // if (i == 5 || i == 10)
        //     $("#timesheet"+a).append("<br />");
    }

    const weekday = ["一", "二", "三", "四", "五", "六", "日"];
    for (let k = 0; k < 7; k++) {
        $("#timesheet"+a+" tr:first").append("<th>" + weekday[k] + "</th>");
        $("#timesheet"+a+" tr:gt(0)").append("<td>&nbsp;</td>");
    }
};

function showClassTable() {
    addTimeSheet(1);
    addTimeSheet(2);

    var cList = $("div.outer_xkxx_list");

    for (let i = 0; i < cList.length; i++) {
        var cNode = $(cList[i]);
        var cName = cNode.find("a.jump").html().replace(/\([a-zA-Z0-9]+\)([^-]+)-.+/ig, "$1");
        var cTime = cNode.find("p.time").html().split("<br>");
        var cTerm = cNode.find("p.xxq" ).html();

        for (let j = 0; j < cTime.length; j++) {
            var day  = cTime[j].match(/一|二|三|四|五|六|日/);
            var time = cTime[j].match(/\d+/g);
            if (cTerm.search("春|秋") != -1) {
                var node = $("#timesheet1 tr:eq("+Number(time[0])+") td:eq("+DayTo[day]+")");
                node.attr("rowspan", time.length);

                //handle conflict
                if (node.html() == '&nbsp;') {
                    node.html(cName.slice(0, 12));
                } else {
                    node.html(node.html().slice(0, 5) + '&amp;<br />' + cName.slice(0, 6))
                }

                for (let k = 1; k < time.length; k++) {
                    $("#timesheet1 tr:eq("+Number(time[k])+") td:eq("+DayTo[day]+")").css('display', 'none');
                }
            }
            if (cTerm.search("冬|夏") != -1) {
                node = $("#timesheet2 tr:eq("+Number(time[0])+") td:eq("+DayTo[day]+")");
                node.attr("rowspan", time.length);

                if (node.html() == '&nbsp;') {
                    node.html(cName.slice(0, 12));
                } else {
                    node.html(node.html().slice(0, 5) + '&amp;<br />' + cName.slice(0, 6))
                }

                for (let k = 1; k < time.length; k++) {
                    $("#timesheet2 tr:eq("+Number(time[k])+") td:eq("+DayTo[day]+")").css('display', 'none');
                }
            }
        }
    }
};

function highLight() {
    $("#yhgnPage").bind('DOMNodeInserted', function() {
        $('tr.body_tr').mouseover(function() {
            var cTerm = $(this).children("td.xxq" ).html();
            var cTime = $(this).children("td.sksj").html().split("<br>");

            for (let j = 0; j < cTime.length; j++) {
                var day  = cTime[j].match(/一|二|三|四|五|六|日/);
                var time = cTime[j].match(/\d+/g);
                for (let k = 0; k < time.length; k++) {
                    if (cTerm.search("春|秋") != -1) {
                        var t = Number(time[k]);
                        var node = $("#timesheet1 tr:eq("+t+") td:eq("+DayTo[day]+")");
                        while (node.css('display') == 'none') {
                            t--;
                            node = $("#timesheet1 tr:eq("+t+") td:eq("+DayTo[day]+")");
                        }
                        if (node.html() == '&nbsp;')
                            node.addClass("selected");
                        else
                            node.addClass("conflict");
                    }
                    if (cTerm.search("夏|冬") != -1) {
                        t = Number(time[k]);
                        node = $("#timesheet2 tr:eq("+t+") td:eq("+DayTo[day]+")");
                        while (node.css('display') == 'none') {
                            t--;
                            node = $("#timesheet2 tr:eq("+t+") td:eq("+DayTo[day]+")");
                        }
                        if (node.html() == '&nbsp;')
                            node.addClass("selected");
                        else
                            node.addClass("conflict");
                    }
                }
            }

        });
        $('tr.body_tr').mouseleave(function() {
            $(".selected").removeClass("selected");
            $(".conflict").removeClass("conflict");
        });
    });
};

function show() {
    $('#showbutton').remove();
    $("body").append("<div id='hidebutton'>hide</div>");
    $("#hidebutton").click(function() {
        hide();
    });
    showClassTable();
    highLight();
}

function hide() {
    $('#timesheet1').remove();
    $('#timesheet2').remove();
    $('#hidebutton').remove();
    $("body").append("<div id='showbutton'>show</div>");
    $("#showbutton").click(function() {
        show();
    });
}

$("body").append("<div id='showbutton'>show</div>");
$("#showbutton").click(function() {
    show();
});
