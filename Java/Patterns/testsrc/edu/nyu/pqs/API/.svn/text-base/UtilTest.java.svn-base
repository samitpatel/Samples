package edu.nyu.pqs.API;

import static edu.nyu.pqs.API.Util.*;
import static org.junit.Assert.*;
import java.io.IOException;
import java.util.Iterator;
import java.util.NoSuchElementException;
import java.util.regex.PatternSyntaxException;

import org.junit.Test;
import edu.nyu.pqs.API.AddressBook;
import edu.nyu.pqs.API.AddressBook.Contact;

/**
 * @author Samit Patel
 *
 */

public class UtilTest {

	private String path = "/Users/samitpatel/contact.txt";
	
	@Test
	public <T> void FilterIteratorTest() throws IOException{

		AddressBook.initializeFile(path);
		new AddressBook.Contact("Samit").mobile("1").addContact();
		new AddressBook.Contact("Amit").mobile("2").addContact();
		new AddressBook.Contact("Nirav").mobile("3").addContact();
		
		AddressBook.commitChanges();

		Iterator<Contact> filterIterator = filter(AddressBook.iterator());
		
		assertEquals("1",((Contact) filterIterator.next()).getMobile());
		assertEquals("2",((Contact) filterIterator.next()).getMobile());
		assertEquals("3",((Contact) filterIterator.next()).getMobile());
		assertFalse(filterIterator.hasNext());
		
		AddressBook.deleteAddressBook();
		
	}
	
	@Test (expected = UnsupportedOperationException.class)
	public <T> void filterIteratorRemoveTest() throws IOException{
		
		try{
			AddressBook.initializeFile(path);
			new AddressBook.Contact("Samit").mobile("1").addContact();
			
			Iterator<Contact> filterIterator = filter(AddressBook.iterator());
			
			filterIterator.remove();
		}finally{
			AddressBook.deleteAddressBook();
		}
		
	}
	
	@Test (expected = NoSuchElementException.class)
	public <T> void filterIteratorNoNextElementTest() throws IOException{
		
		AddressBook.initializeFile(path);
		new AddressBook.Contact("Samit").mobile("1").addContact();
		
		Iterator<Contact> filterIterator = filter(AddressBook.iterator());
		
		try{
			assertEquals("1",((Contact) filterIterator.next()).getMobile());
			assertEquals("1",((Contact) filterIterator.next()).getMobile());
			assertFalse(filterIterator.hasNext());
		}finally{
			AddressBook.deleteAddressBook();
		}
		
	}
	
	
	@Test
	public <T> void NonNullFilterIteratorTest() throws IOException{

		AddressBook.initializeFile(path);
		new AddressBook.Contact("Samit").mobile("1").addContact();
		new AddressBook.Contact("Amit").mobile("2").addContact();
		new AddressBook.Contact("Nirav").mobile("3").addContact();
		
		AddressBook.commitChanges();
		FileOperations.removeContact("Amit");
		AddressBook.commitChanges();
		
		Iterator<Contact> filterIterator = filter(Util.<Contact>nonNull(), 
													AddressBook.iterator());
		
		assertEquals("1",((Contact) filterIterator.next()).getMobile());
		assertEquals("3",((Contact) filterIterator.next()).getMobile());
		assertFalse(filterIterator.hasNext());
		
		AddressBook.deleteAddressBook();
		
	}
	
	
	@Test
	public <T> void AndFilterIteratorTest() throws IOException{

		AddressBook.initializeFile(path);
		new AddressBook.Contact("Samit").mobile("1").addContact();
		new AddressBook.Contact("Amit").mobile("2").addContact();
		new AddressBook.Contact("Nirav").mobile("3").addContact();
		
		AddressBook.commitChanges();
		FileOperations.removeContact("Amit");
		AddressBook.commitChanges();
		
		Criteria<Contact> mobileNumber1 = new Criteria<Contact>() {

			@Override
			public boolean accepts(Contact item) {
				return ((Contact) item).getMobile() == "1";
			}
			
		};
		Criteria<Contact> NON_NULL = nonNull();
		Iterator<Contact> filterIterator = filter(and(NON_NULL, mobileNumber1),
														AddressBook.iterator());
		
		assertEquals("Samit",((Contact) filterIterator.next()).getName());
		assertFalse(filterIterator.hasNext());
		
		AddressBook.deleteAddressBook();
		         
	}
	
	
	@Test
	public <T> void OrFilterIteratorTest() throws IOException{

		AddressBook.initializeFile(path);
		new AddressBook.Contact("Samit").mobile("1111").addContact();
		new AddressBook.Contact("Amit").mobile("2222").addContact();
		new AddressBook.Contact("Nirav").mobile("3333").addContact();
		
		Criteria<Contact> mobileNumber1111 = new Criteria<Contact>() {

			@Override
			public boolean accepts(Contact item) {
				return ((Contact) item).getMobile() == "1111";
			}
			
		};
		
		Criteria<Contact> nameNirav = new Criteria<Contact>() {

			@Override
			public boolean accepts(Contact item) {
				return ((Contact) item).getName() == "Nirav";
			}
			
		};
		Criteria<Contact> NON_NULL = nonNull();
		Iterator<Contact> filterIterator = filter(and(NON_NULL, 
												or(mobileNumber1111,nameNirav)), 
													AddressBook.iterator());
		
		assertEquals("Samit",((Contact) filterIterator.next()).getName());
		assertEquals("Nirav",((Contact) filterIterator.next()).getName());
		assertFalse(filterIterator.hasNext());
		
		AddressBook.deleteAddressBook();
		         
	}
	
	
	@Test
	public <T> void NotFilterIteratorTest() throws IOException{

		AddressBook.initializeFile(path);
		new AddressBook.Contact("Samit").note("Away").addContact();
		new AddressBook.Contact("Phillip").note("Available").addContact();
		new AddressBook.Contact("Amit").note("Away").addContact();
		new AddressBook.Contact("Nirav").note("Available").addContact();
		
		Criteria<Contact> away = new Criteria<Contact>() {

			@Override
			public boolean accepts(Contact item) {
				return ((Contact) item).getNote() == "Away";
			}
			
		};
		
		Criteria<Contact> NON_NULL = nonNull();
		Iterator<Contact> filterIterator = filter(and(NON_NULL, not(away)),
													AddressBook.iterator());
		
		assertEquals("Phillip",((Contact) filterIterator.next()).getName());
		assertEquals("Nirav",((Contact) filterIterator.next()).getName());
		assertFalse(filterIterator.hasNext());
		
		AddressBook.deleteAddressBook();
		         
	}
	
	
	@Test
	public <T> void alwaysTrueFilterIteratorTest() throws IOException{

		AddressBook.initializeFile(path);
		new AddressBook.Contact("Samit").note("Away").addContact();
		new AddressBook.Contact("Phillip").note("Available").addContact();
		new AddressBook.Contact("Amit").note("Away").addContact();
		new AddressBook.Contact("Nirav").note("Available").addContact();
		
		Criteria<Contact> NON_NULL = nonNull();
		Iterator<Contact> filterIterator = filter(
											and(NON_NULL, 
												Util.<Contact>alwaysTrue()),
													AddressBook.iterator());
		
		assertEquals("Samit",((Contact) filterIterator.next()).getName());
		assertEquals("Phillip",((Contact) filterIterator.next()).getName());
		assertEquals("Amit",((Contact) filterIterator.next()).getName());
		assertEquals("Nirav",((Contact) filterIterator.next()).getName());
		assertFalse(filterIterator.hasNext());
		
		AddressBook.deleteAddressBook();
		         
	}
	

	@Test
	public <T> void alwaysFalseFilterIteratorTest() throws IOException{

		AddressBook.initializeFile(path);
		new AddressBook.Contact("Samit").note("Away").addContact();
		new AddressBook.Contact("Phillip").note("Available").addContact();
		new AddressBook.Contact("Amit").note("Away").addContact();
		new AddressBook.Contact("Nirav").note("Available").addContact();
		
		Criteria<Contact> NON_NULL = nonNull();
		Iterator<Contact> filterIterator = filter(and(NON_NULL, 
													Util.<Contact>alwaysFalse()),
															AddressBook.iterator());
		
		assertFalse(filterIterator.hasNext());
		
		AddressBook.deleteAddressBook();
		         
	}
	
	
	@Test
	public <T> void RegexCriteriaTest() throws IOException{

		AddressBook.initializeFile(path);
		new AddressBook.Contact("Samit").mobile("1").addContact();
		new AddressBook.Contact("Amit").mobile("2").addContact();
		new AddressBook.Contact("mit").mobile("2").addContact();
		new AddressBook.Contact("Nirav").mobile("3").addContact();
		
		AddressBook.commitChanges();
		
		Iterator<Contact> filterIterator = filter(Util.<Contact>regex("(A|Sa)*mit"), 
														AddressBook.iterator());
		
		assertEquals("Samit",((Contact) filterIterator.next()).getName());
		assertEquals("mit",((Contact) filterIterator.next()).getName());
		assertEquals("Amit",((Contact) filterIterator.next()).getName());
		assertFalse(filterIterator.hasNext());
		
		AddressBook.deleteAddressBook();
			         
	}
	
	
	@Test (expected = PatternSyntaxException.class)
	public <T> void InvalidRegexTest() throws IOException{

		AddressBook.initializeFile(path);
		new AddressBook.Contact("Samit").mobile("1").addContact();
		new AddressBook.Contact("Amit").mobile("2").addContact();
		new AddressBook.Contact("mit").mobile("2").addContact();
		new AddressBook.Contact("Nirav").mobile("3").addContact();
		
		AddressBook.commitChanges();
		try{
			filter(Util.<Contact>regex("*mit"), AddressBook.iterator());
		}finally{
			AddressBook.deleteAddressBook();
		}
		         
	}
	
	
	@Test 
	public <T> void contactMatcherTest() throws IOException{

		AddressBook.initializeFile(path);
		new AddressBook.Contact("Samit").mobile("123-323-1233").
											homePhone("123-234-4567").
												note("Away").addContact();
		new AddressBook.Contact("Amit").homeAddress("NJ").
											workPhone("985-244-2344").
													addContact();
		new AddressBook.Contact("Nirav").fax("323-543-6554").mobile("123-434-1255").
											workAddress("NJ").addContact();

		Contact contactToBeMatchedTo = new AddressBook.Contact("Nirav").
							 				fax("323-543-6554").
											homePhone("111-222-3333").
											workPhone("999-888-7777").
											mobile("123-434-1255").
											homeAddress("NJ").workAddress("NJ").
											note("Availble");

		Criteria<Contact> matcher = contactMatcher(contactToBeMatchedTo);

		Iterator<Contact> filterIterator = filter(matcher,AddressBook.iterator());

		assertEquals("Amit",((Contact) filterIterator.next()).getName());
		assertEquals("Nirav",((Contact) filterIterator.next()).getName());
		assertFalse(filterIterator.hasNext());
		
		AddressBook.deleteAddressBook(); 
		         
	}

}
