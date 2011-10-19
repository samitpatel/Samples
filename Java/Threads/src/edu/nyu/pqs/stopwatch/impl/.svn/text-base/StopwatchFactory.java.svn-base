package edu.nyu.pqs.stopwatch.impl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import edu.nyu.pqs.stopwatch.api.IStopwatch;

/**
 * The StopwatchFactory is a thread-safe factory class for IStopwatch objects.
 * It maintains references to all created IStopwatch objects and provides a
 * convenient method for getting a list of those objects.
 *
 */
public class StopwatchFactory {

	private static List<IStopwatch> totalStopwatches 
					= new ArrayList<IStopwatch>();
	private static Object totalStopwatchesListLock = new Object();

	/**
	 * Creates and returns a new IStopwatch object
	 * @param id The identifier of the new object
	 * @return The new IStopwatch object
	 * @throws IllegalArgumentException if <code>id</code> is empty, null,
	 * or already taken
	 */
	public static IStopwatch getStopwatch(String id) {
		if(id.isEmpty() || id==null || isIdTaken(id))
			throw new IllegalArgumentException();

		StopWatch stopwatch = new StopWatch(id);
		synchronized(totalStopwatchesListLock){
			totalStopwatches.add(stopwatch);
		}
		return stopwatch;
	}

	/**
	 * Checks whether an object with a specified id exists
	 * @param id The identifier to be checked for existence
	 * @return <code>true</code> if object with <code>id</code> exists else 
	 * <code>false</code>
	 * */
	private static boolean isIdTaken(String id){
		for(IStopwatch s:totalStopwatches){
			if(id.equals(s.getId()))
				return true;
		}	
		return false;
	}

	/**
	 * Returns an unmodifiable copy of list of all created stopwatches
	 * @return a List of all created IStopwatch objects.  Returns an empty
	 * list if no IStopwatches have been created.
	 */
	public List<IStopwatch> getStopwatches(){
		List<IStopwatch> temp = new ArrayList<IStopwatch>();
		synchronized (totalStopwatchesListLock) {
			for(IStopwatch s : totalStopwatches){
				temp.add(s);
			}
		}
		return Collections.unmodifiableList(temp);
	}
}
