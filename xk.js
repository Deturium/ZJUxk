'use strict'

const h = window.hQuery
// const log = console.log.bind(console)
const DayTo = { "一":0, "二":1, "三":2, "四":3, "五":4, "六":5, "日":6 };

function addTimeSheet(num) {

    let tableHtml = `<table id='timesheet${num}'>`

    let term = num === 1 ? "春秋" : "冬夏";
    const weekday = ["一", "二", "三", "四", "五", "六", "日"];

    tableHtml += `<tr><th>${term}</th>${weekday.map((day) => {
        return `<th>${day}</th>`
    }).join('')}</tr>`;

    for (let i = 1; i < 14; i++) {
        tableHtml += `<tr><th>${i}</th>${weekday.map((_, j) => {
            return `<td class="row${i} col${j}">&nbsp;</td>`
        }).join('')}</tr>`;
    }

    h('body').append(tableHtml + '</table>')
}

function showClassTable() {
    addTimeSheet(1)
    addTimeSheet(2)

    h("div.outer_xkxx_list").each(function (i, cNode) {
        let cName = h(cNode).find("a.jump").html().replace(/\([a-zA-Z0-9]+\)([^-]+)-.+/ig, "$1");

        h(cNode).find("div.item").each( function(i, item) {
            let cTerm  = h(item).find("p.xxq" ).html()
            let cTimes = h(item).find("p.time").html().split("<br>")

            cTimes.forEach(function (cTime) {
                let day  = cTime.match(/[一二三四五六日]/)
                let time = cTime.match(/\d+/g)

                let addNode2Sheet = function (num) {
                    let node = h(`#timesheet${num} .row${time[0]}.col${DayTo[day]}`)
                    node.attr("rowspan", time.length)

                    // handle conflict
                    if (node.html() === '&nbsp;') {
                        node.html(cName.slice(0, 12))
                    } else {
                        node.html(node.html().slice(0, 5) + '&amp;<br />' + cName.slice(0, 6))
                    }

                    for (let i = 1; i < time.length; i++) {
                        h(`#timesheet${num} .row${time[i]}.col${DayTo[day]}`).hide()
                    }
                }

                if (cTerm.search("春|秋") !== -1) {
                    addNode2Sheet(1)
                }
                if (cTerm.search("冬|夏") !== -1) {
                    addNode2Sheet(2)
                }
            })
        })
    })
}

function highLight() {
    h("#yhgnPage").on('DOMNodeInserted', function() {
        h('tr.body_tr').on('mouseover', function() {
            let cTerm  = h(this).find("td.xxq" ).html()
            let cTimes = h(this).find("td.sksj").html().split("<br>")

            cTimes.forEach(function (cTime) {
                let day  = cTime.match(/[一二三四五六日]/)
                let time = cTime.match(/\d+/g)
                if (!time.length) {
                    return
                }
                for (let k = 0; k < time.length; k++) {
                    let changeClass = function (num) {
                        let t = Number(time[k]);
                        let node = h(`#timesheet${num} .row${t}.col${DayTo[day]}`)
                        while (node.css('display') === 'none') {
                            t--
                            node = h(`#timesheet${num} .row${t}.col${DayTo[day]}`)
                        }
                        if (node.html() === '&nbsp;')
                            node.addClass("selected")
                        else
                            node.addClass("conflict")
                    }

                    if (cTerm.search("春|秋") !== -1) {
                        changeClass(1)
                    }
                    if (cTerm.search("夏|冬") !== -1) {
                        changeClass(2)
                    }
                }
            })
        });

        h('tr.body_tr').on('mouseleave', function() {
            h(".selected").removeClass("selected");
            h(".conflict").removeClass("conflict");
        });
    });
}

(function () {
    h("body").append("<div id='showbutton'>show</div>");

    let funcSwitch = function(func1, func2) {
        let status = true
        return function() {
            if (status) {
                func1()
            } else {
                func2()
            }
            status = !status
        }
    }

    h("#showbutton").on('click', funcSwitch(
        function () {
            h('#showbutton').text('hide')
            showClassTable();
            highLight();
        },
        function () {
            h('#showbutton').text('show')
            h('#timesheet1, #timesheet2').remove();
        }
    ))
})();
