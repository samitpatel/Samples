package edu.nyu.pqs.API;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;

import edu.nyu.pqs.API.AddressBook.Contact;


/**
 * @author Samit Patel
 *
 */
class FileOperations {
	
	/**
	 * File used to store the contact details ie. the whole address book.
	 * */
	private static File file = null;
	
	/**
	 * Map which store the address book. The changes are all reflected in this 
	 * map and not in files. Function commitChanges() has to be called
	 * explicitly to reflect the changes to file.
	 * */
	private static Map<String,Contact> addressBook = 
											new HashMap<String,Contact>();
	
	
	/**
	 * Initialize the file where the address book is stored. If the file
	 * don't exists, it'll create one. Otherwise it'll load the address book
	 * from the file into the Map.The contacts are stored in Map and the Map 
	 * object is stored in this file.
	 * @param path The path to file.
	 * @throws IOException 
	 * @throws IllegalArgumentException if the path specified is 
	 * 			not valid
	 * */
	@SuppressWarnings("unchecked")
	public static void initializeFile(String path) throws IOException{
		
		if(path == null || path == "")
			throw new IllegalArgumentException("Invalid file path");
		
		file = new File(path);
		
		if(!file.exists())
			file.createNewFile();
		else{
			
			FileInputStream fileInputStream = new FileInputStream(file);
			ObjectInputStream objectInputStream = 
									new ObjectInputStream(fileInputStream);
			try {
				addressBook = 
						(Map<String,Contact>) objectInputStream.readObject();
			} catch (ClassNotFoundException e) {
				e.printStackTrace();
			} 
			objectInputStream.close();
			fileInputStream.close();	
			}
		}
	
	/**
	 * Deletes the whole address book.
	 * @return <code>true</code> or <code>false</code> based on successful
	 * 				 deletion of file.
	 * @throws FileNotFoundException if file is not initialized.
	 * */
	public static boolean deleteAddressBook() throws FileNotFoundException{
		
		if(file == null)
			throw new FileNotFoundException();
		
		if(file.delete()){
			file = null;
			addressBook.clear();
			return true;
		}
		return false;
	}
	
	
	/**
	 * Adds a Contact to Address Book. The contact will be added to Map and has
	 * to call {@link #commitChanges()} to reflect the changes into the file.
	 * @param name The name of Contact to be added.
	 * @param contact Contact object.
	 * @throws FileNotFoundException 
	 * @throws IllegalArgumentException if invalid arguments are passed
	 * 
	 * */
	public static void addContact(String name, Contact contact) throws FileNotFoundException{	
		
		if(name == null || name=="" || contact == null || 
												!(contact instanceof Contact))
			throw new IllegalArgumentException();
		
		addressBook.put(name, contact);
	}
	
	/**
	 * Modifies the contact in address book. Function 
	 * {@link #commitChanges()} has to be
	 * called explicitly to reflect the changes into the file.
	 * @param name The name of contact to be removed.
	 * @param modifiedDetails new contact object with new field values.
	 * @return <code>true</code> on successful modification otherwise 
	 * 			<code>false</code>. 
	 * @throws FileNotFoundException if file is not initialized
	 * */
	public static boolean modifyContact(String name, Contact modifiedDetails) throws FileNotFoundException{
		
		if(file == null)
			throw new FileNotFoundException();
		if(addressBook.containsKey(name)){
			addressBook.put(name, modifiedDetails);
			return true;
		}
		return false;
	}
	
	/**
	 * Removes the contact from address book. {@link #commitChanges()} has to be
	 * called explicitly to reflect the changes into the file.
	 * @param name The name of contact to be removed.
	 * @return <code>true</code> on successful deletion otherwise 
	 * 			<code>false</code>. 
	 * @throws FileNotFoundException if file is not initialized
	 * */
	public static boolean removeContact(String name) throws FileNotFoundException{
		
		if(file == null)
			throw new FileNotFoundException();
		
		return addressBook.remove(name) == null ? false : true;
	}
	
	/**
	 * Returns the iterator of address book. This iterator iterates over the 
	 * {@link Contact} objects stored in the address book.
	 * @return Iterator.
	 * @throws FileNotFoundException if file is not initialized
	 * */
	public static Iterator<Contact> getIterator() throws FileNotFoundException{	
		
		if(file == null)
			throw new FileNotFoundException();

		return new iterator();
	}
	
	
	/**
	 * Commits the changes to the file. One has to call this function explicitly
	 * to reflect any changes made to address book into the file initialized 
	 * using function {@link #initializeFile(String)}.
	 * @return <code>true</code> on successful commit, otherwise <code>false</code>.
	 * @throws FileNotFoundException if file is not initialized
	 * */
	public static boolean commitChanges() throws FileNotFoundException{
		
		if(file == null)
			throw new FileNotFoundException();
		
		if(!file.exists()){
			file = null;
			throw new FileNotFoundException();
		}
		try{
			FileOutputStream fileOutputStream = new FileOutputStream(file);
			ObjectOutputStream objectOutputStream = 
									new ObjectOutputStream(fileOutputStream);
			objectOutputStream.writeObject(addressBook);
			objectOutputStream.close();
			fileOutputStream.close();
			return true;
		}catch(Exception e){
			e.printStackTrace();
			return false;
		}
	}
	
	
	/**
	 * Searches the <code>field</code> value under the Contact specified with 
	 * <code>name</code>.
	 * @param name The name of Contact to be searched for.
	 * @param field The field to searched for
	 * @return The value of the field.
	 * @throws IllegalArgumentException if the invalid arguments
	 * 			are passed
	 * @throws FileNotFoundException if file is not initialized
	 * 
	 * */
	public static String search(String name, String field) 
												throws FileNotFoundException{
		if(file == null)
			throw new FileNotFoundException();
		
		if(name == null || name == "" || field== null || field == "")
			throw new IllegalArgumentException();
			
		return addressBook.get(name).getDetails().get(field);
	}
	
	/**
	 * Searches Contact specified with <code>name</code> in address book.
	 * @param name The name of Contact to be searched for.
	 * @return The  string representation of Contact.
	 * @throws IllegalArgumentException if the invalid arguments 
	 * 			are passed
	 * @throws FileNotFoundException if file is not initialized
	 * 
	 * */
	public static String search(String name) throws FileNotFoundException{
		if(file == null)
			throw new FileNotFoundException();
		
		if(name == null || name == "")
			throw new IllegalArgumentException();
			
		return addressBook.get(name).toString();
	}
	
	/**
	 * Returns the total number of contact in address book.
	 * @return total number of contacts
	 * @throws FileNotFoundException 
	 * @throws FileNotFoundException if file is not initialized.
	 * */
	public static int getTotalContacts() throws FileNotFoundException{
		if(file == null)
			throw new FileNotFoundException();
		
		return addressBook.size();
	}
	
	
	private static class iterator implements Iterator<Contact>{
		
		Iterator<Entry<String, Contact>> iter; 
		
		private iterator() {
			iter = addressBook.entrySet().iterator();
		}
		
		@Override
		public boolean hasNext() {
			return iter.hasNext();
		}

		@Override
		public synchronized Contact next() {
				Map.Entry<String, Contact> pairs = 
									(Map.Entry<String,Contact>)iter.next();
				return pairs.getValue();
		}

		@Override
		public void remove() {
			throw new UnsupportedOperationException("Remove is not supported");
			}
	}
	
}
