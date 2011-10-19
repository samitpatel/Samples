package edu.nyu.pqs.API;

import static org.junit.Assert.*;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Iterator;
import java.util.NoSuchElementException;

import org.junit.Test;

import edu.nyu.pqs.API.AddressBook.Contact;

/**
 * @author Samit Patel
 *
 */

public class FileOperationsTest {

	private String path = "/Users/samitpatel/contact.txt";

	@Test (expected=IllegalArgumentException.class)
	public void nullFile() throws IOException{
		FileOperations.initializeFile(null);
	}	
	
	
	@Test (expected=FileNotFoundException.class)
	public void deleteNullFile() throws IOException{
		FileOperations.deleteAddressBook();
	}
	
	
	@Test (expected=FileNotFoundException.class)
	public void fileNotFound() throws FileNotFoundException{
		FileOperations.deleteAddressBook();
	}
	

	@Test (expected=IllegalArgumentException.class)
	public void addNullContactTest() throws IOException{
		new AddressBook.Contact(null).mobile("1").addContact();
	}
	
	
	@Test
	public <T> void removeValidContactTest() throws IOException{
		
		FileOperations.initializeFile(path);
		new AddressBook.Contact("Samit").mobile("1").note("hi samit").
															addContact();
		new AddressBook.Contact("Amit").mobile("2").note("hi").addContact();
		new AddressBook.Contact("Nirav").mobile("3").addContact();
		
		assertEquals(3,AddressBook.getTotalContacts());
		
		FileOperations.commitChanges();
		boolean flag = AddressBook.removeContact("Amit");
		assertTrue(flag);
		FileOperations.commitChanges();
		
		assertEquals(2,AddressBook.getTotalContacts());
		
		FileOperations.deleteAddressBook();
		
	}
	
	
	@Test 
	public void removeInvalidContactTest() throws IOException{
		
		FileOperations.initializeFile(path);
		new AddressBook.Contact("Samit").mobile("1").addContact();
		new AddressBook.Contact("Amit").mobile("2").addContact();
		new AddressBook.Contact("Nirav").mobile("3").addContact();
		
		FileOperations.commitChanges();
		boolean flag = FileOperations.removeContact("Smit");
		assertFalse(flag);
		FileOperations.commitChanges();
		
		assertEquals(3,AddressBook.getTotalContacts());
		
		FileOperations.deleteAddressBook();
		
	}
	
	
	@Test (expected = FileNotFoundException.class)
	public void removeContactFromInvalidFileTest() throws IOException{
		FileOperations.removeContact("Smit");
	}
	
	
	@Test (expected = FileNotFoundException.class)
	public void getIteratorOfInvalidAddressBookTest() throws IOException{
		FileOperations.getIterator();
	}
	
	
	@Test (expected = FileNotFoundException.class)
	public void searchInInvalidAddressBookTest() throws IOException{
		FileOperations.search("Samit","name");
	}
	
	
	@Test (expected = IllegalArgumentException.class)
	public void invalidSearchTest() throws IOException{
		try{
			FileOperations.initializeFile(path);
			new AddressBook.Contact("Samit").mobile("1").addContact();
			new AddressBook.Contact("Amit").mobile("2").addContact();
			new AddressBook.Contact("Nirav").mobile("3").addContact();
			
			FileOperations.search(null,"name");
		}finally{
			FileOperations.deleteAddressBook();
		}
	}
	
	
	@Test (expected = FileNotFoundException.class)
	public void searchInInvalidAddressBookTest_() throws IOException{
		FileOperations.search("Samit");
	}
	
	
	@Test (expected = IllegalArgumentException.class)
	public void invalidSearchTest_() throws IOException{
		try{
			FileOperations.initializeFile(path);
			new AddressBook.Contact("Samit").mobile("1").addContact();
			new AddressBook.Contact("Amit").mobile("2").addContact();
			new AddressBook.Contact("Nirav").mobile("3").addContact();
			
			FileOperations.search(null);
		}finally{
			FileOperations.deleteAddressBook();
		}
	}
	
	
	@Test
	public <T> void searchContactTest() throws IOException{

		FileOperations.initializeFile(path);
		new AddressBook.Contact("Samit").mobile("1234567890").
											note("Hello there...").addContact();
		
		FileOperations.commitChanges();
		String str = "Contact [name=Samit, fax=null, mobile=1234567890, " +
					"homePhone=null, workPhone=null, homeAddress=null, " +
					"workAddress=null, note=Hello there...]";
		assertEquals(str,AddressBook.search("Samit"));
		
		FileOperations.deleteAddressBook();
		   
	}
	
	
	@Test
	public <T> void searchContactFieldTest() throws IOException{

		FileOperations.initializeFile(path);
		new AddressBook.Contact("Samit").fax("12").mobile("23").homePhone("34").
						workPhone("45").homeAddress("jersey city").
						workAddress("nyc").note("Hey wass up..").addContact();
		
		FileOperations.commitChanges();
		
		assertEquals("Samit",AddressBook.search("Samit", "name"));
		assertEquals("12",AddressBook.search("Samit", "fax"));
		assertEquals("23",AddressBook.search("Samit", "mobile"));
		assertEquals("34",AddressBook.search("Samit", "homePhone"));
		assertEquals("45",AddressBook.search("Samit", "workPhone"));
		assertEquals("jersey city",AddressBook.search("Samit", "homeAddress"));
		assertEquals("nyc",AddressBook.search("Samit", "workAddress"));
		assertEquals("Hey wass up..",AddressBook.search("Samit", "note"));
		
		FileOperations.deleteAddressBook();
		       
	}
	
	
	@Test
	public <T> void contactModificationTest() throws IOException{

		FileOperations.initializeFile(path);
		new AddressBook.Contact("Samit").mobile("11111").note("Hey")
															.addContact();
		
		FileOperations.commitChanges();

		Iterator<Contact> iterator = FileOperations.getIterator();
		Contact contact = iterator.next();
		
		assertEquals("11111",contact.getMobile());
		
		assertTrue(FileOperations.modifyContact("Samit", 
										new AddressBook.Contact("Samit")
														.mobile("22222")));
		
		iterator = FileOperations.getIterator();
		contact = iterator.next();
		
		assertEquals("22222",contact.getMobile());
		
		FileOperations.deleteAddressBook();
		
	}
	
	
	@Test
	public <T> void invalidContactModificationTest() throws IOException{

		FileOperations.initializeFile(path);
		new AddressBook.Contact("Samit").mobile("11111").note("Hey")
															.addContact();
		
		FileOperations.commitChanges();
		assertFalse(FileOperations.modifyContact("Michael", 
									new AddressBook.Contact("Samit")
										.mobile("22222")));
	
		FileOperations.deleteAddressBook();	
	}
	
	
	@Test (expected = FileNotFoundException.class)
	public <T> void modificationInInvalidFileTest() throws IOException{
		try{
			FileOperations.modifyContact("Michael", 
								new AddressBook.Contact("Samit")
													.mobile("22222"));
		}finally{
			FileOperations.deleteAddressBook();
		}
	}
	
	
	@Test (expected = FileNotFoundException.class)
	public void commitToInvalidFileTest() throws IOException{
		FileOperations.commitChanges();
	}
	
	
	@Test
	public void copyObjectFromFile() throws IOException {
		FileOperations.initializeFile(path);
		new AddressBook.Contact("Samit").mobile("1").addContact();
		new AddressBook.Contact("Amit").mobile("2").addContact();
		new AddressBook.Contact("Nirav").mobile("3").addContact();
		
		FileOperations.commitChanges();
		
		FileOperations.initializeFile(path);
		
		Iterator<Contact> addressBook = AddressBook.iterator();
		assertEquals("1",((Contact) addressBook.next()).getMobile());
		assertEquals("2",((Contact) addressBook.next()).getMobile());
		assertEquals("3",((Contact) addressBook.next()).getMobile());
		assertFalse(addressBook.hasNext());
		
		FileOperations.deleteAddressBook();
	}
	
	
	@Test (expected = UnsupportedOperationException.class)
	public <T> void iteratorRemoveTest() throws IOException{
		
		FileOperations.initializeFile(path);
		new AddressBook.Contact("Samit").mobile("1").addContact();
		
		Iterator<Contact> iterator = AddressBook.iterator();
		try{
			iterator.remove();
		}finally{
			FileOperations.deleteAddressBook();
		}
	}
	
	
	@Test (expected = NoSuchElementException.class)
	public <T> void iteratorNoNextElementTest() throws IOException{
		
		FileOperations.initializeFile(path);
		new AddressBook.Contact("Samit").mobile("1").addContact();
		
		Iterator<Contact> iterator = AddressBook.iterator();
		try{
			assertTrue(iterator.hasNext());
			assertEquals("1",((Contact) iterator.next()).getMobile());
			assertEquals("1",((Contact) iterator.next()).getMobile());
		}finally{
			FileOperations.deleteAddressBook();
		}
	}
	
	
	@Test (expected = FileNotFoundException.class)
	public void getTotalContactsFromInvalidAddressBook() 
												throws FileNotFoundException{
		FileOperations.getTotalContacts();
	}

}
