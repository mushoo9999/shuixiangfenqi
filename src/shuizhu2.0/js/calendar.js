// Call this from the developer console and you can control both instances
var calendars = {};

$(document).ready( function() {

    var events = [
    	{
    		date: '2016-11-10',
    		name: '还款日',
    		bnum: '借款金额：1000元',
    		bmethod: '还款方式：到期本息'
    	},
    	{
    		date: '2016-12-20',
    		name: '回款日',
    		inum: '投资金额：1000元',
    		imethod: '还款方式：到期本息',
    		title: '优选理财-45天'
    	}
    ];



calendars.clndr1 = $('.cal1').clndr({
        daysOfTheWeek: ['日', '一', '二', '三', '四', '五', '六'],
        
        multiDayEvents: {
            singleDay: 'date'
        },
        clickEvents:{
            nextMonth: function (month) {
                events = [{
                    date: '2017-1-20',
                            name: '回款日',
                            inum: '投资金额：1000元',
                            imethod: '还款方式：到期本息',
                            title: '优选理财-45天'
                }];
                calendars.clndr1.setEvents(events);
               
                
            },
            previousMonth: function (month) {

            },
        },
        events: events,
        doneRendering: function () {
            
        	$(events).each(function(){
                console.log($('.event').attr('class'));
        		if($(this).attr('name') === "还款日"){
        			$('.calendar-day-' + $(this).attr('date')).addClass('event-huan');
        		}else if($(this).attr('name') === "回款日"){
        			$('.calendar-day-' + $(this).attr('date')).addClass('event-hui');
        		}else if($(this).attr('name') === "还款/回款日"){
        			$('.calendar-day-' + $(this).attr('date')).addClass('event-he');
        		}
        	});
        }
    });
	

    

});
