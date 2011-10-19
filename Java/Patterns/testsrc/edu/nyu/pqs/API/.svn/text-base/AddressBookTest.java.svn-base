package edu.nyu.pqs.API;

import static org.junit.Assert.*;
import static edu.nyu.pqs.API.Util.*;

import java.io.IOException;
import java.util.Iterator;
import java.util.NoSuchElementException;
import org.junit.Test;

import edu.nyu.pqs.API.AddressBook;
import edu.nyu.pqs.API.AddressBook.Contact;

/**
 * @author Samit Patel
 *
 */

public class AddressBookTest {

	private String path = "/Users/samitpatel/contact.txt";
	
	@Test (expected = IllegalArgumentException.class)
	public <T> void addContactWithoutNameTest() throws IOException{
		new AddressBook.Contact().mobile("1").addContact();
	}
	
	@Test 
	public <T> void addContactTest() throws IOException{
		
		AddressBook.initializeFile(path);
		new AddressBook.Contact("Samit").mobile("1").addContact();
		new AddressBook.Contact("Amit").mobile("2").addContact();
		new AddressBook.Contact("Nirav").mobile("3").addContact();
		
		AddressBook.commitChanges();

		Iterator<Contact> addressBook = AddressBook.iterator();
		assertEquals("1",((Contact) addressBook.next()).getMobile());
		assertEquals("2",((Contact) addressBook.next()).getMobile());
		assertEquals("3",((Contact) addressBook.next()).getMobile());
		
		assertTrue(AddressBook.deleteAddressBook()); 
		
	}
	
	
	@Test
	public <T> void getContactDetailsTest() throws IOException{

		Contact contact = new AddressBook.Contact("Samit").fax("12").mobile("23").homePhone("34").
						workPhone("45").homeAddress("jersey city").
						workAddress("nyc").note("Hey wass up..");
		
		assertEquals("Samit",contact.getName());
		assertEquals("12",contact.getFax());
		assertEquals("23",contact.getMobile());
		assertEquals("34",contact.getHomePhone());
		assertEquals("45",contact.getWorkPhone());
		assertEquals("jersey city",contact.getHomeAddress());
		assertEquals("nyc",contact.getWorkAddress());
		assertEquals("Hey wass up..",contact.getNote());
		
	}
	

	@Test
	public <T> void notEqualContactTest() throws IOException{

		Contact first = new AddressBook.Contact("Samit").fax("1123123").mobile("5636").
						homePhone("34534").workPhone("234").
						homeAddress("Boston").workAddress("Miami").
						note("Hey wass up..");
		
		Contact second = new AddressBook.Contact("Michael").fax("123123").mobile("987").
						homePhone("132948").workPhone("671204").
						homeAddress("New Jersey").workAddress("NYC").
						note("Hello");

		assertFalse(first.equals(second));
		
	}
	
	
	@Test
	public <T> void prettySimilarContactTest() throws IOException{

		Contact first = new AddressBook.Contact("Samit").fax("1123123").mobile("5636").
						homePhone("34534").workPhone("234").
						homeAddress("Boston").workAddress("Miami").
						note("Hey wass up..");
		
		Contact second = new AddressBook.Contact("Michael").fax("1123123").mobile("5636").
						homePhone("34534").workPhone("234").
						homeAddress("Boston").workAddress("Miami").
						note("Hey wass up..");

		assertFalse(first.equals(second));
		
	}
	
	
	@Test
	public <T> void onlyNameContactEqualTest() throws IOException{

		Contact first = new AddressBook.Contact("Samit");
		Contact second = new AddressBook.Contact("Michael");

		assertFalse(first.equals(second));
		
	}
	
	
	@Test
	public <T> void nullEqualsContactTest() throws IOException{

		Contact first = new AddressBook.Contact("Samit");

		assertFalse(first.equals(null));
		
	}
	
		
	@Test
	public <T> void emptyContactEqualsContactTest() throws IOException{

		Contact first = new AddressBook.Contact("Samit");
		Contact second = new AddressBook.Contact("Michael").fax("1123123").
						mobile("5636").homePhone("34534").workPhone("234").
						homeAddress("Boston").workAddress("Miami").
						note("Hey wass up..");

		assertFalse(first.equals(second));
		
	}
	
	
	@Test
	public <T> void equalContactTest() throws IOException{

		Contact first = new AddressBook.Contact("Samit").fax("12").mobile("23").
						homePhone("34").workPhone("45").homeAddress("jersey city").
						workAddress("nyc").note("Hey wass up..");
		Contact second = new AddressBook.Contact("Samit").fax("12").mobile("23").
						homePhone("34").workPhone("45").homeAddress("jersey city").
						workAddress("nyc").note("Hey wass up..");
		
		assertFalse(first.equals(""));
		assertFalse(second.equals(""));
		assertTrue(first.equals(first));
		assertTrue(second.equals(second));
		assertTrue(first.equals(second));
		assertTrue(second.equals(first));
		 
	}
	
	
	@Test
	public <T> void contactHashCodeTest() throws IOException{

		Contact first = new AddressBook.Contact("Samit").fax("323-543-6554").
										homePhone("111-222-3333").
										workPhone("999-888-7777").
										mobile("123-434-1255").
										homeAddress("NJ").workAddress("NJ").
										note("Availble");
		Contact second = new AddressBook.Contact("Samit").fax("323-543-6554").
										homePhone("111-222-3333").
										workPhone("999-888-7777").
										mobile("123-434-1255").
										homeAddress("NJ").workAddress("NJ").
										note("Availble");
		Contact third = new AddressBook.Contact("Samit").fax("12").
										mobile("23").homePhone("34").
										workPhone("45").homeAddress("jersey city").
										workAddress("nyc").note("Hey wass up..");

		
		assertEquals(first.hashCode(),second.hashCode()); 
		assertFalse(first.hashCode() == third.hashCode());
		
	}
	
	@Test
	public <T> void contactHashCodeOfEmptyContactTest() throws IOException{

		Contact contact = new AddressBook.Contact();
		
		assertEquals(contact.hashCode(),contact.hashCode());
		
	}
	
	
	@Test
	public <T> void searchContactFieldTest() throws IOException{

		AddressBook.initializeFile(path);
		new AddressBook.Contact("Samit").fax("12").mobile("23").homePhone("34").
						workPhone("45").homeAddress("jersey city").
						workAddress("nyc").note("Hey wass up..").addContact();
		
		AddressBook.commitChanges();
		
		assertEquals("Samit",AddressBook.search("Samit", "name"));
		assertEquals("12",AddressBook.search("Samit", "fax"));
		assertEquals("23",AddressBook.search("Samit", "mobile"));
		assertEquals("34",AddressBook.search("Samit", "homePhone"));
		assertEquals("45",AddressBook.search("Samit", "workPhone"));
		assertEquals("jersey city",AddressBook.search("Samit", "homeAddress"));
		assertEquals("nyc",AddressBook.search("Samit", "workAddress"));
		assertEquals("Hey wass up..",AddressBook.search("Samit", "note")); 
		
		AddressBook.deleteAddressBook();
		       
	}
	
	
	@Test
	public <T> void searchContactTest() throws IOException{

		AddressBook.initializeFile(path);
		new AddressBook.Contact("Samit").mobile("1234567890")
										.note("Hello there...").addContact();
		
		AddressBook.commitChanges();
		String str = "Contact [name=Samit, fax=null, mobile=1234567890, " +
					"homePhone=null, workPhone=null, homeAddress=null, " +
					"workAddress=null, note=Hello there...]";
		assertEquals(str,AddressBook.search("Samit"));
		
		AddressBook.deleteAddressBook();
		   
	}
	
	
	@Test
	public <T> void contactModificationTest() throws IOException{

		AddressBook.initializeFile(path);
		new AddressBook.Contact("Samit").mobile("11111").note("Hey").addContact();
		
		AddressBook.commitChanges();

		Iterator<Contact> iterator = AddressBook.iterator();
		Contact contact = iterator.next();
		
		assertEquals("11111",contact.getMobile());
		
		AddressBook.modifyContact("Samit", new AddressBook.Contact("Samit")
															.mobile("22222"));
		
		iterator = AddressBook.iterator();
		contact = iterator.next();
		
		assertEquals("22222",contact.getMobile());
		
		AddressBook.deleteAddressBook();
		
	}
	
	
	@Test 
	public <T> void iteratorTest() throws IOException{
		
		AddressBook.initializeFile(path);
		new AddressBook.Contact("Samit").mobile("1").addContact();
		new AddressBook.Contact("Amit").mobile("2").addContact();
		new AddressBook.Contact("Nirav").mobile("3").addContact();
		
		Iterator<Contact> iterator = AddressBook.iterator();
		assertEquals("1",((Contact) iterator.next()).getMobile());
		assertEquals("2",((Contact) iterator.next()).getMobile());
		assertEquals("3",((Contact) iterator.next()).getMobile());
		
		AddressBook.deleteAddressBook();
		
	}
	
	
	@Test (expected = UnsupportedOperationException.class)
	public <T> void iteratorRemoveTest() throws IOException{
		
		AddressBook.initializeFile(path);
		new AddressBook.Contact("Samit").mobile("1").addContact();
		
		Iterator<Contact> iterator = AddressBook.iterator();
		try{
			iterator.remove();
		}finally{
			AddressBook.deleteAddressBook();
		}
		
	}
	
	
	@Test (expected = UnsupportedOperationException.class)
	public <T> void contactIteratorRemoveTest() throws IOException{
		
		AddressBook.initializeFile(path);
		new AddressBook.Contact("Samit").mobile("1").addContact();
		
		Iterator<Contact> iterator = AddressBook.iterator(); 
		try{
			Contact contact = iterator.next();
			contact.getIterator().remove();
		}finally{
			AddressBook.deleteAddressBook();
		}
		
	}
	
	
	@Test (expected = NoSuchElementException.class)
	public <T> void iteratorNoNextElementTest() throws IOException{
		
		AddressBook.initializeFile(path);
		new AddressBook.Contact("Samit").mobile("1").addContact();
		
		Iterator<Contact> iterator = AddressBook.iterator();
		try{
			assertEquals("1",((Contact) iterator.next()).getMobile());
			assertEquals("1",((Contact) iterator.next()).getMobile());
		}finally{
			AddressBook.deleteAddressBook();
		}
		
	}
	
	
	@Test
	public void removeContactTest() throws IOException{
		
		AddressBook.initializeFile(path);
		new AddressBook.Contact("Samit").mobile("1").addContact();
		new AddressBook.Contact("Amit").mobile("2").addContact();
		new AddressBook.Contact("Nirav").mobile("3").addContact();
		
		AddressBook.commitChanges();
		AddressBook.removeContact("Amit");
		AddressBook.commitChanges();
		
		Iterator<Contact> filterIterator = filter(Util.<Contact>nonNull(),
													AddressBook.iterator());
		
		assertEquals("1",((Contact) filterIterator.next()).getMobile());
		assertEquals("3",((Contact) filterIterator.next()).getMobile());
		
	}
	
	
	@Test
	public void getTotalContactsTest() throws IOException{
		
		AddressBook.initializeFile(path);
		new AddressBook.Contact("Samit").mobile("1").addContact();
		new AddressBook.Contact("Amit").mobile("2").addContact();
		new AddressBook.Contact("Nirav").mobile("3").addContact();
		
		AddressBook.commitChanges();
		
		assertEquals(3,AddressBook.getTotalContacts());
		
		AddressBook.removeContact("Amit");
		AddressBook.commitChanges();
		
		assertEquals(2,AddressBook.getTotalContacts());
		
	}
	
	
	@Test
	public <T> void FilterIteratorTest() throws IOException{

		AddressBook.initializeFile(path);
		new AddressBook.Contact("Samit").mobile("1").addContact();
		
		AddressBook.commitChanges();

		Iterator<Contact> iterator = AddressBook.iterator();
		Contact contact = iterator.next();
		assertTrue(contact.getIterator().hasNext());
		assertEquals(null,contact.getIterator().next().getValue());
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
		}finally{
			AddressBook.deleteAddressBook();
		}
		
	}
	
}
