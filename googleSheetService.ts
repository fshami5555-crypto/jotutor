import { UserProfile, Course, Teacher, Testimonial, BlogPost, HeroSlide, StaffMember, Payment, SiteContent, OnboardingOptions } from './types';

// ⬇️ *** IMPORTANT SETUP STEP *** ⬇️
// Replace this URL with your actual Google Apps Script Web App URL.
// Follow the instructions in SETUP_INSTRUCTIONS.md to get this URL.
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxfTNiT6Q0ZJBQCJjzqv2ptB4gMAZllJfLFsvEdxKs9zQz5W3FZrSi2bCNtlfV-XHOv/exec'; 

export const isGoogleSheetConfigured = () => {
    if (!SCRIPT_URL || SCRIPT_URL.includes('YOUR_GOOGLE_APPS_SCRIPT_URL_HERE')) {
        return false;
    }
    return true;
}

/**
 * Sends a POST request to the Google Apps Script.
 */
const postToScript = async (action: string, payload: any) => {
     if (!isGoogleSheetConfigured()) {
        console.warn(
            `%cGoogle Sheets Persistence Disabled%c
Changes are only saved locally and will be lost on refresh.
To enable saving, follow the SETUP_INSTRUCTIONS.md and add your script URL to googleSheetService.ts.`,
            "color: orange; font-weight: bold;",
            "color: inherit;"
        );
        return { success: true, message: 'Simulated success (local only).' };
    }
    try {
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action, payload })
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error(`Error in postToScript for action "${action}":`, error);
        return { success: false, error: (error as Error).message };
    }
}

/**
 * Fetches all necessary data from the Google Sheet in a single request.
 */
export const fetchAllData = async (): Promise<any> => {
    if (!isGoogleSheetConfigured()) {
        throw new Error("Google Sheet URL is not configured.");
    }
    try {
        const response = await postToScript('fetchAll', {});
        if (!response.success) {
            throw new Error(response.error || 'Failed to fetch all data from script.');
        }
        return response.data;
    } catch (error) {
        console.error('Error in fetchAllData:', error);
        throw error;
    }
};


/**
 * Appends a new row of data to a specified sheet.
 */
export const appendRow = async (sheetName: string, rowData: object): Promise<{ success: boolean; message?: string; error?: string }> => {
    return postToScript('appendRow', { sheetName, rowData });
};

/**
 * Overwrites an entire sheet with a new set of data.
 */
export const overwriteSheet = async (sheetName: string, data: object[]): Promise<{ success: boolean; message?: string; error?: string }> => {
    return postToScript('overwriteSheet', { sheetName, data });
};

/**
 * Updates the key-value configuration sheet.
 */
export const updateConfig = async (configData: { siteContent?: SiteContent | null, onboardingOptions?: OnboardingOptions | null }): Promise<{ success: boolean; message?: string; error?: string }> => {
    return postToScript('updateConfig', configData);
};