import React, {createContext, useState, useEffect} from "react";

//NOTE: if the context changes frequently, it can trigger unecessary re-renders across the components subscribing to it.
//Create Context
export const DataContext = createContext();

//Provider Component
const DataProvider = ({ children }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        //Simulate fetching mock data 
        const fetchData = async () => {
            setLoading(true) //for subsequent fetches
            try {
                const response = await fetch("/db.json");
                if (!response.ok) {
                    throw new Error(`HTTP Error! status: ${response.status}`);
                }
                //parse the fetched data
                const result = await response.json();
                setData(result);
            } catch (error) {
                console.error("Failed to fetch data:", error) //catches fetching error
            } finally { //always executes regardless of error or not
                setLoading(false);
            }
        };

        fetchData();
    }, []); //Dependency Array is empty. Therfore fetchData runs only one time, when DataProvider component is first rendered
            //(ie. when the app is first mounted on the root)

    return (
        <DataContext.Provider value = {{ data, setData, loading, setLoading}}>
            {children}
        </DataContext.Provider>
    );
};

export default DataProvider;