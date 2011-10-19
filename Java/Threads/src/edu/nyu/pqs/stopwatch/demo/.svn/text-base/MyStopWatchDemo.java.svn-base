package edu.nyu.pqs.stopwatch.demo;

import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.logging.Logger;

import edu.nyu.pqs.stopwatch.api.IStopwatch;
import edu.nyu.pqs.stopwatch.impl.SimpleThreadFactory;
import edu.nyu.pqs.stopwatch.impl.StopwatchFactory;

/**
 * This is a simple program that demonstrates the functionality of the 
 * IStopwatch interface and StopwatchFactory class.
 * 
 */
public class MyStopWatchDemo {

	public static SimpleThreadFactory simpleThreadFactory 
	= new SimpleThreadFactory();
	/** use a logger instead of System.out.println */
	private static final Logger logger = 
			Logger.getLogger("edu.nyu.pqs.ps4.demo.SlowThinker");

	/**
	 * Run the myStopWatchExample demo application
	 * @param args 
	 * @throws InterruptedException 
	 */
	public static void main(String[] args) throws InterruptedException {
		MyStopWatchDemo example = new MyStopWatchDemo();
		example.go();
	}

	/**
	 * Starts the myStopWatchExample object
	 * It will get a ExecutorService with defined threadPoolSize.Than it
	 * gets the CountDownLatch to control the start and stop of all threads.
	 * Than it submits the Runnable task to executor to execute it using any
	 * available Thread from its pool.
	 * and then print out all the lap times
	 * @throws InterruptedException 
	 *
	 */

	private void go() throws InterruptedException {

		int threadPoolSize = 2; 
		ExecutorService executor = 
				Executors.newCachedThreadPool(simpleThreadFactory);
		final CountDownLatch ready = new CountDownLatch(threadPoolSize);
		final CountDownLatch start = new CountDownLatch(1);
		final CountDownLatch done = new CountDownLatch(threadPoolSize);

		final IStopwatch stopwatch = StopwatchFactory.getStopwatch(
				"ID 1");

		Runnable task1 = new Runnable() {
			public void run() {
				ready.countDown(); //tells timer that this thread is ready
				try{
					start.await(); //waits for all threads to be ready

					for (int i = 0; i < 5; i++) {
						try {
							Thread.sleep(650);
						} catch (InterruptedException ie) {
							/* safely ignore this */
						}
						stopwatch.lap();
					}

				}catch(InterruptedException e){
					Thread.currentThread().interrupt();
				}finally{
					done.countDown();	// tells timer that this thread is done
					//executing
				}
			}
		};

		Runnable task2 = new Runnable() {
			public void run() {
				ready.countDown(); //tells timer that this thread is ready
				try{
					start.await(); //waits for all threads to be ready
					for (int i = 0; i < 5; i++) {
						try {
							Thread.sleep(650);
						} catch (InterruptedException ie) {
							/* safely ignore this */ 
						}
						stopwatch.lap();

					}

				}catch(InterruptedException e){
					Thread.currentThread().interrupt();
				}finally{
					done.countDown();	// tells timer that this thread is 
					//done executing
				}
			}
		};


		executor.execute(task1);
		executor.execute(task2);

		ready.await(); // Waits for all threads to be ready.
		stopwatch.start(); //starts the stopwatch
		start.countDown();//Kicks off all the thread execution
		done.await();//Waits for all threads to finish execution.
		stopwatch.stop();//stops the stopwatch
		executor.shutdown();

		List<Long> times = stopwatch.getLapTimes();
		logger.info("Lap Times\n" + times.toString());
		logger.info("List of StopWatch objects\n" + new StopwatchFactory().
				getStopwatches().toString());

	}
}
