package edu.nyu.pqs.API;

import java.util.Iterator;
import java.util.NoSuchElementException;
import java.util.Map.Entry;
import java.util.regex.Pattern;
import java.util.regex.PatternSyntaxException;

import edu.nyu.pqs.API.AddressBook.Contact;

/**
 * @author Samit Patel
 *
 */

/**
 * Utility class which provides method to create various combinations of 
 * criteria to search through the address book.
 * */
public class Util {

	/**
	 * Restricting the initialization of this Util class.
	 * */
	private Util(){}
	
	/**
	 * Returns an iterator for the Address Book. This is used to iterate through
	 * the Contact present in the address book.
	 * @return {@link Iterator} object
	 * */
	public static <T> Iterator<T> filter(Iterator<T> iterator){
		return new FilterIterator<T>(iterator);
	}
	
	/**
	 * Returns an iterator for Address Book but the iterator will return the 
	 * contacts that satisfies the {@link Criteria} object passed in the constructor.
	 * @return {@link Iterator} object
	 * */
	public static <T> Iterator<T> filter(Criteria<T> criteria, Iterator<T> iterator){
		return new FilterIterator<T>(criteria, iterator);	
	}
	
	/**
	 * Returns a decorated {@link Criteria} object based on the <code>and</code> logic of
	 * two {@link Criteria} objects passed in the constructor.
	 * @return {@link Criteria} object
	 * */
	public static <T> Criteria<T> and(Criteria<T> first, Criteria<T> second){
		return new AndCriteria<T>(first, second);
	}
	
	/**
	 * Returns a decorated {@link Criteria} object based on the <code>or</code> logic of
	 * two {@link Criteria} objects passed in the constructor.
	 * @return {@link Criteria} object
	 * */
	public static <T> Criteria<T> or(Criteria<T> first, Criteria<T> second){
		return new OrCriteria<T>(first, second);
	}
	
	/**
	 * Returns a decorated {@link Criteria} object based on the <code>not</code> logic of
	 * {@link Criteria} object passed in the constructor.
	 * @return {@link Criteria} object
	 * */
	public static <T> Criteria<T> not(Criteria<T> criteria){
		return new NotCriteria<T>(criteria);
	}
	
	/**
	 * Return a {@link Criteria} object which will always accept every item passed to it.
	 * @return {@link Criteria} object
	 * */
	public static <T> Criteria<T> alwaysTrue(){
		return new TrueCriteria<T>();
	}
	
	/**
	 * Return a {@link Criteria} object which will always reject every item passed to it.
	 * @return {@link Criteria} object
	 * */
	public static <T> Criteria<T> alwaysFalse(){
		return new FalseCriteria<T>();
	}
	
	/**
	 * Return a {@link Criteria} object which will accept item which are 
	 * not null.
	 * @return {@link Criteria} object
	 * */
	public static <T> Criteria<T> nonNull(){
		return new NonNullCriteria<T>();
	}
	
	/**
	 * Return a {@link Criteria} object which will accept item based on the 
	 * regular expression passed to its constructor.
	 * @return {@link Criteria} object
	 * */
	public static <T> Criteria<T> regex(String pattern){
		return new RegexCriteria<T>(pattern);
	}
	
	/**
	 * Returns a {@link Criteria} object which will accept item based on the 
	 * contact fields that are set. The fields are set by passing a 
	 * {@link Contact} object.
	 * @param contact contact used to set the fields which will be used for
	 * 			comparing the fields of the contacts.
	 * @return {@link Criteria} object
	 * */
	public static <T> Criteria<T> contactMatcher(Contact contact){
		return new ContactMatcherCriteria<T>(contact);
	}
	
	
	
	/**
	 * This class provides an iterator over the contacts present in the address
	 * book. If the object is created using only an Iterator as the 
	 * parameter it'll will create an iterator which will return each contact 
	 * in the address book.
	 * But if the Iterator is created using a Criteria object along with the 
	 * Iterator object, it'll create an iterator that will return the Contacts 
	 * that matches the criteria specified by the Criteria object.
	 * */
	private static class FilterIterator<T> implements Iterator<T> {


		Iterator<T> iterator; 
		Criteria<T> criteria;
		T contact;
		
		private FilterIterator(Iterator<T> iterator) {
			this.criteria = new TrueCriteria<T>();
			this.iterator = iterator;
			contact = getNextContact();   
		}
		
		private FilterIterator(Criteria<T> criteria, Iterator<T> iterator) {
			this.criteria = criteria;
			this.iterator = iterator;
			contact = getNextContact();      
		}
		
		@Override
		public boolean hasNext() {
			return contact != null;
		}

		@Override
		public T next() {
			if(contact == null)
				throw new NoSuchElementException("sorry no more elements");
			
			T oldContact = contact;
			contact = getNextContact();
			return oldContact;
		}
		
		private T getNextContact(){
			while(iterator.hasNext()){
				T item = iterator.next();
				if(criteria.accepts(item))
					return item;
			}
			return null;
		}
		
		@Override
		public void remove() {
			throw new UnsupportedOperationException("Remove is not supported");
		}

	}
	
	
	
	
	/**
	 * This class provides an Criteria object that is a logical AND
	 * between two Criteria objects that are passed as the arguments. 
	 * */
	private static class AndCriteria<T> implements Criteria<T> {

		Criteria<T> first;
		Criteria<T> second;
		
		private AndCriteria(Criteria<T> first, Criteria<T> second){
			this.first = first;
			this.second = second;
		}
		
		@Override
		public boolean accepts(T item) {
			return first.accepts(item) && second.accepts(item);
		}	
	}

	
	/**
	 * This class provides an Criteria object that is a logical OR
	 * between two Criteria objects that are passed as the arguments. 
	 * */
	private static class OrCriteria<T> implements Criteria<T> {

		Criteria<T> first;
		Criteria<T> second;
		
		private OrCriteria(Criteria<T> first, Criteria<T> second){
			this.first = first;
			this.second = second;
		}
		
		@Override
		public boolean accepts(T item) {
			return first.accepts(item) || second.accepts(item);
		}
	}
	
	/**
	 * This class provides an Criteria object that is a logical NOT
	 * of the {@link Criteria} object that is passed as the argument. 
	 * */
	private static class NotCriteria<T> implements Criteria<T> {

		Criteria<T> criteria;
		
		private NotCriteria(Criteria<T> criteria){
			this.criteria = criteria;
		}

		@Override
		public boolean accepts(T item) {
			return !criteria.accepts(item);
		}
	}
	
	/**
	 * This class provides an Criteria object that is always TRUE.
	 * */
	private static class TrueCriteria<T> implements Criteria<T> {

		@Override
		public boolean accepts(T item) {
			return true;
		}
	}
	
	/**
	 * This class provides an Criteria object that is always FALSE.
	 * */
	private static class FalseCriteria<T> implements Criteria<T> {

		@Override
		public boolean accepts(T item) {
			return false;
		}
	}
	
	/**
	 * This class provides a Criteria object that will always return a non null
	 * object.
	 * */
	private static class NonNullCriteria<T> implements Criteria<T> {

		@Override
		public boolean accepts(T item) {
			return item != null;
		}
	}
	
	/**
	 * This class provides a Criteria object which accepts the contact based on
	 * matching of any contact field value with the passed regular expression.
	 * */
	private static class RegexCriteria<T> implements Criteria<T> {

		String regex;
		private RegexCriteria(String regex){
				this.regex = regex;
		}
		
		@Override
		public boolean accepts(T item) {
			
			Iterator<Entry<String,String>> contactDetails = ((AddressBook.Contact) item).getIterator();
			
			while(contactDetails.hasNext()){
				try{
					String str =  contactDetails.next().getValue();
					if(str != null && Pattern.matches(regex, str))
						return true;
					
				}catch(PatternSyntaxException e){
					throw new PatternSyntaxException("Invalid pattern", regex, e.getIndex());
				}
			}
			return false;
		}
	}

	/**
	 * This class provides a Criteria which accepts the Contact based on the 
	 * Contact object passed. It basically matches the corresponding fields 
	 * and accepts a Contact if any of the fields matches.
	 * */
	private static class ContactMatcherCriteria<T> implements Criteria<T> {

		private String name = null;
		private String fax = null;
		private String mobile = null;
		private String homePhone = null;
		private String workPhone = null;
		private String homeAddress = null;
		private String workAddress = null;
		private String note = null;
		
		private ContactMatcherCriteria(Contact contact){
			
			name = contact.getName();
			fax = contact.getFax();
			mobile = contact.getMobile();
			homePhone = contact.getHomePhone();
			workPhone = contact.getWorkPhone();
			homeAddress = contact.getHomeAddress();
			workAddress = contact.getWorkAddress();
			note = contact.getNote();
		}
		
		@Override
		public boolean accepts(T item) {
			Contact contact = (Contact)item;
			return 	(name != null && name.equals(contact.getName())) ||
					(fax != null && fax.equals(contact.getFax())) ||
					(mobile != null && mobile.equals(contact.getMobile())) ||
					(homePhone != null &&
								homePhone.equals(contact.getHomePhone())) ||
					(workPhone != null && 
								workPhone.equals(contact.getWorkPhone())) ||
					(homeAddress != null && 
								homeAddress.equals(contact.getHomeAddress())) ||
					(workAddress != null && 
								workAddress.equals(contact.getWorkAddress())) ||
					(note != null && note.equals(contact.getNote()));
		}

		
	}
}	

