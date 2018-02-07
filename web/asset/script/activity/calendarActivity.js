define(['system', 'jquery', 'jquery-draggable'], function (system, $) {
    
    function pullSchedule(){
                $.ajax({//  캘린더 데이터 불러오기
                    type: 'post',
                    async:false,
                    url: '/smart_mirror/web/php/calendar_pull.php',
                    success: function (data) {
                        schedules = JSON.parse(data);
//                        console.log(schedules);
//                        console.log(schedules[0].date.split(' '));
                        var i = 0;
                        // 년월일 , 시간 분리 
                        for (; i < schedules.length; i++) {
                            // 년,월,일 
                            schedules[i].mon = schedules[i].date.split(' ')[0].substring(0,2);
                            schedules[i].d = schedules[i].date.split(' ')[0].substring(3,5);
                            schedules[i].year = schedules[i].date.split(' ')[0].substring(6,10);
                            // 시,분 
                            schedules[i].hour = schedules[i].date.split(' ')[1].substring(0,2);
                            schedules[i].min = schedules[i].date.split(' ')[1].substring(3,5);
                            //요일
                            schedules[i].day = new Date(schedules[i].year+'-'+
                                                        schedules[i].mon+'-'+
                                                        schedules[i].d).getDay();
                            schedules[i].time = schedules[i].date.split(' ')[1];
                        }                      

                    }
                })         
            }
    var calendar;
    var schedules;
    return {

        id: 'calendarActivity',
        title: '달력',
        icon: 'ic_calendar.png',
        layoutHTML: 'activity_calendar.html',
                    
        init: function () {
            console.log('calendar init');       
            pullSchedule();
        },

        resume: function () {
            console.log('calendar resume');
            calendar = setInterval(function () {
                             pullSchedule();
                            }, 1000);
            function date()
            {
                this.year;
                this.month;
                this.firstD;
                this.lastD;
                this.sun;
            }
            (function ()
            {
                this.setYear = function (year) {
                    this.year = year;
                }
                this.setMonth = function (month) {
                    this.month = month;
                }
                this.setSun = function (sun) {
                    this.sun = sun;
                }
                this.setFirstD = function (day) {
                    this.firstD = day;
                }
                this.setLastD = function (day) {
                    this.lastD = day;
                }
            }.call(date.prototype));
            var date = new date();
            var korean_day = ['일', '월', '화', '수', '목', '금', '토'];
            var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            var months = ['January', 'February', 'March', 'April', 'May', 'Jun', 'July', 'August', 'September', 'October', 'Nobember', 'December'];
            var day_array = new Array();
            var current_year = new Date().getFullYear();
            var current_month = new Date().getMonth();

            today();
            $("#today").click(function ()
            {
                today();
            })
            $("#right").click(function () {
                right();
            })
            $("#left").click(function () {
                left();
            })

            function today() {
                var firstDay, lastDay;
                var total_sofar;
                var d = new Date();
                var i = 1;
                var year = d.getFullYear(); // 2017
                var month = d.getMonth(); // 3
                var today = d.getDate(); // 오늘 일
                var total = new Date(year, month + 1, 0).getDate(); // 그달의 총 일수
                var sum = 0;

                for (; i <= month; i++) { // 이번달 까지의 총 일수
                    total_sofar = new Date(year, i, 0).getDate();
                    sum += total_sofar;
                }
                sum = sum + today;

                var getToday = days[d.getDay()];  // 오늘의 요일 
                var r = 0;
                if (getToday != 'Sun')
                {
                    while (getToday != days[r])
                    { // 오늘이 일요일이 아니라면
                        r++;
                    }
                }
                var sunday = today - r; // 일요일 날짜!!!! 

                if (sunday <= 0) { // 이전달 
                    sunday = new Date(year, month, 0).getDate() + sunday;
                    total = new Date(year, month, 0).getDate(); // 이전 달의 총 일수
                    month--;
                }
                var s = sunday;
                var isbeyond = false;
                var g = 0;
                i = 0;
                z = 0;
                for (; i < 7; i++) { // 일요일부터 토요일까지 출력
                    if (s > total) { // 달이 이어질때, 그 달의 총 일수 초과
                        month++;
                        s = 1;
                        isbeyond = true;
                        beyond_tmp = month; // beyond_tmp로 12~1월 제어
                        if (month == 12)
                            month = 0;
                    }
                    if (i == 0)
                        firstDay = s;
                    if (i == 6)
                        lastDay = s;

                    str = korean_day[i] + ", " + s;
                    $("thead > tr > th").eq(i + 1).html(str);
                    if (s == today) {
                        addColor(i + 1);
                        day_array[i] = s;
                    }
                    s++;

                }
                if (isbeyond) {
                    month = beyond_tmp;
                    month--;
                } // beyond_tmp가 없으면 month가 0보다 작아짐 . *month는 전역변수

                $("#year-month > span").text(year); //0 년
                headerDate(month, firstDay, lastDay);
                updateDate(year, month, sunday);
                
            }
            function left() {
                var tmp = date.month,
                        year = date.year,
                        month = date.month,
                        sunday = date.sun - 7; // 일요일 날짜
                var firstDay,
                        lastDay,
                        i = 0,
                        eachTime = 0;

                for (; eachTime < 23; eachTime++)
                {
                    for (; i <= 7; i++)
                    {
                        $("tr:eq(1)").children().eq(i).empty(); // 일정 불러온 뒤 날짜 넘길때 비움
                    }
                    i = 0
                }
                eachTime = 0;
                if (sunday <= 0)
                {
                    month--;
                    if (sunday <= 0 && months[tmp] == 'January')
                    { // 일요일이 0이하, 1월일때
                        year--;
                        month = 11; // 12월
                    }
                    var total = new Date(year, month + 1, 0).getDate(); // 그달의 총 일수
                    sunday = total + (sunday); // 그달의 마지막 일요일
                }
                i = 0;
                day = sunday;
                var beyond_tmp;
                var isbeyond;
                for (; i < 7; i++)
                { // 일요일부터 토요일까지 출력
                    if (day > total)
                    { // 달이 이어질때, 그 달의 총 일수 초과
                        month++;
                        day = 1;
                        isbeyond = true;
                        beyond_tmp = month; // beyond_tmp로 12~1월 제어
                        if (month == 12)
                            month = 0;
                    }
                    if (i == 0)
                        firstDay = day;
                    if (i == 6)
                        lastDay = day;

                    str = korean_day[i] + ", " + day;
                    $("thead > tr > th").eq(i + 1).html(str);
                    if (day == today && current_month == month && current_year == year)
                    { // 오늘 날짜면, 오늘 날짜에 색깔 추가 
                        addColor(i + 1);
                    } else {
                        initColor(i + 1);
                    }
                    z = 0;
                    day_array[i] = day;
//                    for (; z < real_event.length; z++) {
//
//                        if (year == real_event[z].year && month == real_event[z].month && day == real_event[z].day) {
//
//                            var eventday = day_array.indexOf(real_event[z].day); // 일정 day                                   
//                            
//                            $("tr:eq(1)").children().eq(i).html("<ul></ul>");
//                            $("ul:eq("+i+")").append(
//                                "<li><h1>"+real_event[z].hour+"시" + 
//                                real_event[z].min + '분</h1><h2>' + 
//                                real_event[z].title+"</h2></li>" 
//                                );
////                            
//                            add_location(z,eventday);
//                            $("#at" + real_event[z].hour).children().eq(eventday+1).css('padding-top',real_event[z].min+"px");
//
//
//                        }
//
//                    }
                    day++;

                }
                if (isbeyond) {
                    month = beyond_tmp;
                    month--;
                } // beyond_tmp가 없으면 month가 0보다 작아짐 . *month는 전역변수

                $("#year-month > span").text(year); // 월 년
                headerDate(month, firstDay, lastDay);
                updateDate(year, month, sunday);

            }
            function right() {
                var tmp = date.month,
                        year = date.year,
                        month = date.month,
                        sunday = date.sun + 7;
                var total = new Date(year, month + 1, 0).getDate(); // 그달의 총 일수
                var firstDay,
                        lastDay,
                        i = 0;
//                for (; p < 23; p++) { // 달력에 나타내는 일정 초기화. ( 모두 없앰 )  
//                    for (; i < 7; i++) {
//                         $("thead > tr > th").eq(i+1).empty(); // 날짜 넘길때 비움
//                    }
//                    i=0;
//                }

                if (sunday > total) { // 다음달로 넘어갈때
                    month++;

                    if (sunday > total && months[tmp] == 'December') { //  1월로 넘어갈때
                        year++;
                        month = 0; // 1월
                    }

                    sunday = sunday - total; // 그달의 첫번째 일요일

                }

                i = 0;
                var day = sunday;
                var beyond_tmp;
                var isbeyond = false;

                for (; i < 7; i++) { // 일요일부터 토요일까지 출력
                    if (day > total) { // 달이 이어질때, 그 달의 총 일수 초과
                        month++;
                        day = 1;
                        isbeyond = true;
                        beyond_tmp = month; // beyond_tmp로 12~1월 제어
                        if (month == 12)
                            month = 0;
                    }

                    if (i == 0)
                        firstDay = day;

                    if (i == 6)
                        lastDay = day;

                    str = korean_day[i] + ", " + day;
                    $("thead > tr > th").eq(i + 1).html(str);

                    if (day == today && current_month == month && current_year == year) { // 오늘 날짜면, 오늘 날짜에 색깔 추가 
                        addColor(i + 1);
                    } else {
                        initColor(i + 1);
                    }
                    z = 0;
                    day_array[i] = day;
                    day++;

                }
                if (isbeyond) {
                    month = beyond_tmp;
                    month--;
                } // beyond_tmp가 없으면 month가 0보다 작아짐 . *month는 전역변수

                $("#year-month > span").text(year); // 년
                headerDate(month, firstDay, lastDay);
                updateDate(year, month, sunday);
            }

            function updateDate(year, month, sunday) {
                date.setYear(year);
                date.setMonth(month);
                date.setSun(sunday);
            }

            function addSchedule(i)
            {
                $("tr:eq(1)").children().eq(i).html("<ul class='data'></ul>");
                $(".data:eq(" + i + ")").append(
                        "<li><h1>" + real_event[z].hour + "시" +
                        real_event[z].min + '분</h1><h2>' +
                        real_event[z].title + "</h2></li>"
                        );
            }

            function addColor(i) {
                $("thead > tr > th").eq(i).css("color", "red");
            }

            function initColor(i)
            {
                $("thead > tr > th").eq(i).css("color", "initial");
            }

            function headerDate(month, firstDay, lastDay)
            { // 그 주의 첫번째,마지막 월,일      
                var m2 = (month + 1);
                if (month < 9)
                {
                    m = "0" + (month + 1);
                } else
                {
                    m = (month + 1);
                }
                if (firstDay < 10)
                    firstDay = "0" + firstDay;
                if (lastDay < 10)
                    lastDay = "0" + lastDay;
                if (firstDay > lastDay)
                    m2++;
                if (m2 == 13)
                    m2 = 1;
                
                m2 = m2 < 10 ? '0'+m2 : m2;
                $("#year-month > strong").text(m + '/' + firstDay + '  -  ' + m2 + '/' + lastDay);
                
                // 스케쥴이 많을시 불러오는데 시간이 걸릴수도 있기 때문에 타이머 설정.
                setTimeout(function(){
                    addSchedules($('#year-month > span').html(),m,firstDay);
                },100);               
                
                function addSchedules(year,m,firstDay){
                    $('td').empty();
                    $('tbody .headcol').eq(1).html('00:00');
                    var time = 1;
                    var i = 4
                    for(; i<52; i=i+2)
                    {
                        $('body .headcol').eq(i).html(time+":00");
                        time++;
                    }
                    
                    //  스케쥴 삽입 //  
                    i = 0;
                    // 년,월,일이 일치 하면 그 자리에 삽입
                    var total;
                    var day=firstDay;
                    total = new Date(year, m, 0).getDate();
                    while (schedules[i]) 
                    {
                        
                        for(var j=0; j<7; j++){
                            if(schedules[i].year == year && 
                               schedules[i].mon == m &&
                               schedules[i].d == day)
                            {
                                $('tbody tr td:nth-child(' + ( schedules[i].day + 2) + ')').
                                eq(schedules[i].hour * 2).html('<strong>' + schedules[i].title + '</strong>');
                                
                                if(temp>total)
                                {
                                    m++;
                                    day = 0;
                                }
                            }
                            day++;
                        }
                        day = firstDay;
                        i++;
                    }
                }
            
               
          }
      
        },

        pause: function () {
            console.log('calendar pause');
            clearInterval(calendar);
        },

        destroy: function () {
            console.log('calendar destroy');
            clearInterval(calendar);
        },
    }
})

