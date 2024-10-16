import { useRouter } from "next/router";
import EventList from "../../components/events/event-list";
import { Fragment, useEffect, useState } from "react";
import ResultsTitle from "../../components/events/results-title";
import Button from "../../components/ui/button";
import ErrorAlert from "../../components/ui/error-alert";
import useSWR from "swr";
import Head from "next/head";

function FilteredEventsPage(){

    const [loadedEvents, setLoadedEvents] = useState();

    const router =useRouter();

    const filterData = router.query.slug;

    const {data, error} = useSWR("https://nextjs-course-8ec8a-default-rtdb.firebaseio.com/events.json");

    useEffect (()=>{
        if(data){
            const events = [];
        for(const key in data){
            events.push({
                id: key,
            ...data[key],
        });
    }
    setLoadedEvents(events);
}
    }, [data]);

    let pageHeadData = <Head>
    <title>Filtered Events</title>
    <meta 
    name="description" 
    content= {`A list of filtered events.`}
    /> 
    </Head>

if(!loadedEvents){
    return (
    <Fragment>
        {pageHeadData}
        <p className="center">Loading...!</p>
    </Fragment>
    )
}

    const filteredYear = filterData[0];
    const filterMonth = filterData[1];

    const numYear = +filteredYear;
    const numMonth = +filterMonth; 

      if(isNaN(numYear)|| isNaN(numMonth) || numYear>2030 || numYear<2021 || numMonth<1 || numMonth > 12 || error){
        return (
        <Fragment>
            <ErrorAlert>
            <p>Invalid Filter... Please Adjust Your Values..!</p>
            </ErrorAlert>
            <div className="center">
                <Button link="/events">Show All Events</Button>
            </div>
        </Fragment>
        )
    }
    const filteredEvents = allEvents.filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate.getFullYear() === numYear && eventDate.getMonth() === numMonth - 1;
    });
  

    if(!filteredEvents || filteredEvents.length === 0){
        return (
        <Fragment>
            <p>No Events Found...!</p>
        <Button link="/events">Show All Events</Button>
        </Fragment> 
        )
    }

    const date = new Date(numYear, numMonth -1);

    return (
        <Fragment>
            <Head>
               <title>Filtered Events</title>
               <meta 
               name="description" 
               content= {`All events for ${numMonth}/${numYear}`} 
               /> 
            </Head>
            <ResultsTitle date={date}/>
            <EventList item = {filteredEvents} />
        </Fragment>
    );
}

/*export async function getServerSideProps(context) {
    
    const {params} = context;
    const filterData = params.slug;

    const filteredYear = filterData[0];
    const filterMonth = filterData[1];

    const numYear = +filteredYear;
    const numMonth = +filterMonth;

    if(isNaN(numYear)|| isNaN(numMonth) || numYear>2030 || numYear<2021 || numMonth<1 || numMonth > 12){
        return {
            props: {hasError: ture}
            
        }
    }

    const filteredEvents = getFilteredEvents({
        year: numYear,
        month: numMonth,
    });

    return {
        props: {
            events: filteredEvents,
            date: {
                year: numYear,
                month: numMonth
            }
        }
    }
}*/

export default FilteredEventsPage;