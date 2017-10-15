'use strict'

// for debug
const log = console.log.bind(console)


const h = window.hQuery

const DayTo = { "一": 0, "二": 1, "三": 2, "四": 3, "五": 4, "六": 5, "日": 6 };

function makeTimeSheet(num) {

    let tableHtml = `<table id='timesheet${num}'>`

    let term = num === 1 ? "春秋" : "冬夏";
    const weekday = ["一", "二", "三", "四", "五", "六", "日"];

    tableHtml += `<tr><th>${term}</th>${weekday.map((day) =>
        `<th>${day}</th>`
    ).join('')}</tr>`;

    for (let i = 1; i < 14; i++) {
        tableHtml += `<tr><th>${i}</th>${weekday.map((_, j) =>
            `<td class="row${i} col${j}">&nbsp;</td>`
        ).join('')}</tr>`;
    }

    h('body').append(tableHtml + '</table>')
}

function parseCourse() {
    let courses = new Map()

    h("div.outer_xkxx_list").each(function (i, item) {
        let title = h(item).find("a.jump")
            .html()
            .replace(/\(([a-zA-Z0-9]+)\)([^-]+)-(\d\.?\d).+/ig, "$1 $2 $3")
            .split(' ')

        let [id, name, credit] = title

        courses.set(name, [])

        h(item).find("div.item").each(function (i, item) {
            let course = h(item)

            let term = course.find("p.xxq")
                .html()

            let teachers = course.find("p.teachers")
                .html()
                .split("<br>")
                .map(s => s.trim())

            let times = course.find("p.time")
                .html()
                .split("<br>")
                .map(s => s.trim())

            let addrs = course.find("p.addr")
                .html()
                .split("<br>")
                .map(s => s.trim())

            courses.get(name).push(
                { id, credit, term, teachers, times, addrs }
            )
        })
    })

    return courses
}

function showCourseTable() {
    makeTimeSheet(1)
    makeTimeSheet(2)

    let courses = parseCourse()

    for (let [name, course] of courses) {
        for (let c of course) {

            c.times.forEach(function (time) {
                let day = time.match(/[一二三四五六日]/)
                let nth = time.match(/\d+/g)

                let draw = (num) => {
                    let td = h(`#timesheet${num} .row${nth[0]}.col${DayTo[day]}`)
                    td.attr("rowspan", nth.length)

                    // handle conflict
                    if (td.html() === '&nbsp;') {
                        td.html(name.slice(0, 12))
                    } else {
                        td.html(td.html().slice(0, 5) + '&amp;<br />' + name.slice(0, 6))
                    }

                    for (let i = 1; i < nth.length; i++) {
                        h(`#timesheet${num} .row${nth[i]}.col${DayTo[day]}`).hide()
                    }
                }

                if (c.term.search("春|秋") !== -1) draw(1)
                if (c.term.search("冬|夏") !== -1) draw(2)
            })
        }
    }
}

function enableHighLight() {
    h("#yhgnPage").on('DOMNodeInserted', function () {
        h('tr.body_tr').on('mouseover', function () {
            let term  = h(this).find("td.xxq").html()
            let times = h(this).find("td.sksj").html().split("<br>")

            times.forEach(function (time) {
                let day = time.match(/[一二三四五六日]/)
                let nth = time.match(/\d+/g)
                
                if (!nth.length) return

                for (let k = 0; k < nth.length; k++) {
                    let highLight = function (num) {
                        let t = parseInt(nth[k]);
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

                    if (term.search("春|秋") !== -1) highLight(1)
                    if (term.search("夏|冬") !== -1) highLight(2)
                }
            })
        });

        h('tr.body_tr').on('mouseleave', function () {
            h(".selected").removeClass("selected");
            h(".conflict").removeClass("conflict");
        });
    });
}

(function () {
    h("body").append("<div id='showbutton'>show</div>");

    let switchFunc = function (func1, func2) {
        let status = true
        return function () {
            if (status) {
                func1()
            } else {
                func2()
            }
            status = !status
        }
    }

    h("#showbutton").on('click', switchFunc(
        function () {
            h('#showbutton').text('hide')
            showCourseTable();
            enableHighLight();
        },
        function () {
            h('#showbutton').text('show')
            h('#timesheet1, #timesheet2').remove();
        }
    ))
})();
