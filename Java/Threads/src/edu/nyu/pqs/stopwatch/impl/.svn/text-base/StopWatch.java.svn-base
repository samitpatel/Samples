package edu.nyu.pqs.stopwatch.impl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

import edu.nyu.pqs.stopwatch.api.IStopwatch;

/**
 * The StopWatch is a thread-safe class which provides the various stopwatch
 * methods. It provides various methods to control start, stop and lap events. 
 * It also maintains a list of all laptimes.
 * 
 * */
public class StopWatch implements IStopwatch {

	private String id;
	private List<Long> lapTimes = Collections.synchronizedList(new ArrayList<Long>());
	private AtomicLong startTime = new AtomicLong(0);
	private boolean stopWatchOn = false;//Indicates whether the stopwatch is
	//started or not	
	private AtomicLong stopTime = new AtomicLong(0);
	private AtomicLong lapTime = new AtomicLong(0);
	private Object lapTimeLock = new Object();

	/**
	 * Sets the id of the new object
	 * @param id The identifier of the new object
	 * */
	public StopWatch(String id){
		this.id=id;
	}


	/**
	 * Returns the Id of this stopwatch
	 * @return the Id of this stopwatch.  Will never be empty or null.
	 */
	@Override
	public String getId() {
		return id;
	}

	/**
	 * Starts the stopwatch.
	 * @throws IllegalStateException if called when the stopwatch is already running
	 */
	@Override
	public synchronized void start() {
		if(stopWatchOn)
			throw new IllegalStateException();
			
		startTime.set(Math.round((double)System.nanoTime()/1000000));
		lapTime.set(startTime.get());
		stopWatchOn = true;
		//System.out.println(id+" started at 0 miliseconds");

	}

	/**
	 * Stores the time elapsed since the last time lap() was called
	 * or since start() was called if this is the first lap.
	 * @throws IllegalStateException if called when the stopwatch isn't running
	 */
	@Override
	public void lap() {
		if(!stopWatchOn)
			throw new IllegalStateException();

		synchronized(lapTimeLock){
			AtomicLong temp = new AtomicLong(Math.round((double)System.nanoTime()/1000000));
			lapTime.set(temp.get() - lapTime.get());
			lapTimes.add(lapTime.get());
			//System.out.println(id+" lap at "
			//		+lapTime.get()+" miliseconds");
			lapTime.set(temp.get());
			//System.out.println(Math.round((double)System.nanoTime()/1000000));
		}		
	}

	/**
	 * Stops the stopwatch (and records one final lap).
	 * @throws IllegalStateException if called when the stopwatch isn't running
	 */
	@Override
	public void stop() {
		synchronized(lapTimeLock){
			if(!stopWatchOn)
				throw new IllegalStateException();
		
			stopWatchOn = false;
			AtomicLong stop = new AtomicLong(Math.round((double)System.nanoTime()/1000000));
		
			lapTime.set(stop.get() - lapTime.get());
			lapTimes.add(lapTime.get());
		
			stopTime.set(stop.get() - startTime.get());
		}
	}

	/**
	 * Resets the stopwatch.  If the stopwatch is running, this method stops the
	 * watch and resets it.  This also clears all recorded laps.
	 */
	@Override
	public void reset() {
		stopWatchOn = false;
		startTime.set(0);
		stopTime.set(0);
		lapTime.set(0);
		lapTimes.clear();
		//System.out.println(id+" reset");
	}

	/**
	 * Returns a list of lap times (in milliseconds). This method can be called at
	 * any time and will not throw an exception.
	 * @return a list of recorded lap times or an empty list if no times are recorded.
	 */
	@Override
	public List<Long> getLapTimes() {
		List<Long> tempArrayList = new ArrayList<Long>();
			for(Long l : lapTimes){
				tempArrayList.add(l);	
			}
		return Collections.unmodifiableList(tempArrayList);
	}

	/**
	 * Returns the hashCode of the instance.
	 * */
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		synchronized(lapTimeLock){
			result = prime * result + 
					((lapTime == null) ? 0 : lapTime.hashCode());
		}
		result = prime * result
				+ ((lapTimes == null) ? 0 : lapTimes.hashCode());
		result = prime * result
				+ ((startTime == null) ? 0 : startTime.hashCode());
		result = prime * result
				+ ((stopTime == null) ? 0 : stopTime.hashCode());
		result = prime * result + (stopWatchOn ? 1231 : 1237);
		return result;
	}

	/**
	 * Checks whether the object is equal to calling object
	 * @param Object object to compared with the calling object
	 * @return <code>true</code> or <code>false</code> depending on whether
	 * objects are equals or not.s
	 * */
	@Override
	public boolean equals(Object obj) {

		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		StopWatch other = (StopWatch) obj;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		synchronized (lapTimeLock) {
			if (lapTime == null) {
				if (other.lapTime != null)
					return false;
			} else if (!lapTime.equals(other.lapTime))
				return false;
		}
		if (lapTimes == null) {
			if (other.lapTimes != null)
				return false;
		} else if (!lapTimes.equals(other.lapTimes))
			return false;
		
		if (startTime == null) {
			if (other.startTime != null)
				return false;
		} else if (!startTime.equals(other.startTime))
			return false;
		if (stopTime == null) {
			if (other.stopTime != null)
				return false;
		} else if (!stopTime.equals(other.stopTime))
			return false;
		if (stopWatchOn != other.stopWatchOn)
			return false;
		return true;
	}

	/**
	 * Returns the string representation of the object.
	 * @return string representation of object
	 * */
	@Override
	public String toString() {
		synchronized (lapTimeLock) {
			return "StopWatch [id=" + id + ", stopWatchOn=" + stopWatchOn + 
					", startTime=0" + ", stopTime=" + stopTime + 
					", lapTimes=" + lapTimes + "]";
		}
	}


}
