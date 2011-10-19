package edu.nyu.pqs.API;

/**
 * @author Samit Patel
 *
 */

/**
 * Interface used to create Criteria instance which implements accepts method.
 * Accepts method is where all the conditions for the selection or rejection
 * of item is written.
 * */
public interface Criteria<T> {
	public boolean accepts(T item);
}
