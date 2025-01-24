import conf from "../Conf/conf";
import { Client, ID, Databases ,Query } from "appwrite";

export class Service {
    client = new Client();
    databases;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
    }

    // Booking function
    async createBooking({ Enrollment_no, Name, Branch_Dept, Councellor, Date_slot, Enroll }) {
        try {
            // Log data before calling Appwrite
            if (!Councellor) {
                console.error("Councellor is missing or undefined");
                return false;
            }
    
            console.log("Booking Data:", { Enrollment_no, Name, Branch_Dept, Councellor, Date_slot, Enroll });
    
            const response = await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                ID.unique(),
                {
                    Enrollment_no,
                    Name,
                    Branch_Dept,
                    Councellor, // Ensure the field name matches exactly
                    Date_slot,
                    Enroll,  // Add Enroll to the document
                }
            );
    
            return response;
        } catch (error) {
            console.log("Appwrite service :: createBooking :: error", error);
            return false;
        }
    }
    
    // Add Counsellor function
    async addCounsellor({ Enroll, Name, Email, Slot , Password }) {
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId_2, // counsellor collection ID
                ID.unique(),
                {
                    Enroll,
                    Name,
                    Email,
                    Password,
                    Slot,
                }
            );
        } catch (error) {
            console.log("Appwrite service :: addCounsellor :: error", error);
            return false;
        }
    }
    async authenticateCounsellor({ Enroll, Email, Password }) {
        try {
            // Ensure Enroll is treated as an integer
            const enrollInt = parseInt(Enroll, 10);
    
            const response = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId_2,
                [
                    Query.equal("Enroll", enrollInt),  // Ensure Enroll is an integer
                    Query.equal("Email", Email),
                    Query.equal("Password", Password),
                ]
            );
    
            if (response.documents.length > 0) {
                console.log("Matched Document:", response.documents[0]); // Log the matched document
                return { documents: response.documents };
            } else {
                return { error: "Counsellor not found." };
            }
        } catch (error) {
            console.log("Appwrite service :: authenticateCounsellor :: error", error);
            return { error: error.message || "An unexpected error occurred." };
        }
    }
    async getCounsellorDetailsByEnroll(Enroll) {
        try {
            // Ensure Enroll is treated as an integer
            const enrollInt = parseInt(Enroll, 10);
    
            // Query the database to fetch the details of the row with the specified Enroll
            const response = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId_2,
                [Query.equal("Enroll", enrollInt)] // Ensure the query matches the Enroll value
            );
    
            if (response.documents.length > 0) {
                
                return response.documents[0]; // Return the first matching document
            } else {
                return { error: "Counsellor not found." }; // Return error if no match found
            }
        } catch (error) {
            console.log("Appwrite service :: getCounsellorDetailsByEnroll :: error", error);
            return { error: error.message || "An unexpected error occurred." }; // Handle errors
        }
    }
    async getAllCounsellors() {
        try {
            const response = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId_2
            );
        
            if (response.documents.length > 0) {
                console.log("All Counsellor Details:", response.documents); // Log the entire collection
                return response.documents; // Return all documents in the collection
            } else {
                return { error: "No counsellors found." }; // Return an error if no data is found
            }
        } catch (error) {
            console.log("Appwrite service :: getAllCounsellors :: error", error);
            return { error: error.message || "An unexpected error occurred." }; // Handle errors
        }
    }
    async getAllRowsByEnroll(Enroll) {
        try {
            // Ensure Enroll is treated as an integer
            const enrollInt = parseInt(Enroll, 10);
    
            // Query the database to fetch all rows with the specified Enroll
            const response = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                [Query.equal("Enroll", enrollInt)] // Query to match the Enroll value
            );
    
            if (response.documents.length > 0) {
                return response.documents; // Return all matching documents
            } else {
                return { error: "No documents found with the specified Enroll." }; // Error if no documents are found
            }
        } catch (error) {
            console.log("Appwrite service :: getAllRowsByEnroll :: error", error);
            return { error: error.message || "An unexpected error occurred." }; // Handle errors
        }
    }
    async updateCounsellorSlot({ Enroll, newSlots }) {
        try {
            const enrollInt = parseInt(Enroll, 10);
            const response = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId_2,
                [Query.equal("Enroll", enrollInt)]
            );
    
            if (response.documents.length > 0) {
                const counsellorId = response.documents[0].$id;
                const formattedSlots = JSON.stringify(
                    newSlots.map((slot) => ({
                        start: slot.start,
                        end: slot.end,
                    }))
                );
    
                if (formattedSlots.length > 500) {
                    throw new Error("Slot data exceeds maximum character length of 500.");
                }
    
                const updateResponse = await this.databases.updateDocument(
                    conf.appwriteDatabaseId,
                    conf.appwriteCollectionId_2,
                    counsellorId,
                    { Slot: formattedSlots }
                );
    
                console.log("Updated document response:", updateResponse);
                return updateResponse;
            } else {
                return { error: "Counsellor not found." };
            }
        } catch (error) {
            console.error("Appwrite service :: updateCounsellorSlot :: error", error);
            return { error: error.message || "An unexpected error occurred." };
        }
    }
    async getSlotsByEnroll(Enroll) {
        try {
            console.log("Raw Enroll value received:", Enroll);
    
            const enrollInt = parseInt(Enroll, 10); // Convert to integer
            console.log("Parsed Enroll value:", enrollInt);
    
            if (isNaN(enrollInt)) {
                console.error("Invalid Enroll value provided.");
                return { error: "Invalid Enroll value provided." };
            }
    
            const response = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId_2,
                [Query.equal("Enroll", enrollInt)]
            );
    
            console.log("Response from Appwrite:", response);
    
            if (response.documents.length > 0) {
                const document = response.documents[0];
                console.log("Fetched slots:", document.Slot);
                return document.Slot || [];
            } else {
                console.warn("No documents found for the provided Enroll.");
                return { error: "No slots found for the provided Enroll." };
            }
        } catch (error) {
            console.error("Error in getSlotsByEnroll:", error);
            return { error: error.message || "An unexpected error occurred." };
        }
    }
    async  getLeaveByEnroll(enroll) {
        try {
          const enrollInt = parseInt(enroll, 10); // Ensure Enroll is an integer
          if (isNaN(enrollInt)) {
            throw new Error('Invalid Enroll number');
          }
      
          // Query to fetch the counselor's document using Enroll
          const response = await service.databases.listDocuments(
            conf.appwriteDatabaseId,
            conf.appwriteCollectionId_2, // Collection containing counselor data
            [Query.equal('Enroll', enrollInt)]
          );
      
          if (response.documents.length > 0) {
            const leave = response.documents[0].Leave || '';
            console.log('Retrieved Leave:', leave);
            return leave;
          } else {
            console.warn('No documents found for the provided Enroll.');
            return null;
          }
        } catch (error) {
          console.error('Error retrieving Leave:', error);
          throw error;
        }
      }
      
      // Function to edit the Leave column by Enroll
      async editLeaveByEnroll({ enroll, newLeaves }) {
        try {
          // Parse enroll as an integer
          const enrollInt = parseInt(enroll, 10);
          console.log('Parsed Enroll:', enrollInt); // Log for debugging
      
          if (isNaN(enrollInt)) {
            throw new Error('Invalid Enroll number');
          }
      
          // Query to fetch counselor's document using Enroll
          const response = await service.databases.listDocuments(
            conf.appwriteDatabaseId, // Database ID
            conf.appwriteCollectionId_2, // Collection ID
            [Query.equal('Enroll', enrollInt)] // Filter by Enroll
          );
      
          console.log('Query Response:', response);
      
          if (response.documents.length > 0) {
            const documentId = response.documents[0].$id;
      
            // Convert newLeaves to a JSON string to meet the type requirement
            const leaveString = JSON.stringify(newLeaves);
      
            if (leaveString.length > 10000) {
              throw new Error("New leave data exceeds the maximum allowed length (10000 characters).");
            }
      
            const updateResponse = await service.databases.updateDocument(
              conf.appwriteDatabaseId,
              conf.appwriteCollectionId_2,
              documentId,
              { Leave: leaveString } // Updated Leave as a JSON string
            );
      
            console.log('Leave column updated successfully:', updateResponse);
            return updateResponse;
          } else {
            console.warn('No documents found for the provided Enroll.');
            return null;
          }
        } catch (error) {
          console.error('Error updating Leave column:', error);
          throw error;
        }
      }
      
    
    
    
    
    

}


const service = new Service();
export default service;
