export const specialities = ["Cardiologist", "Audiologist", "Dentist", "ENT Specialist", "Gynaecologist", "General Physician", "Paediatrician", "Pyschiatrist", "Radiologist", "Pulmologist", "Oncologist", "Neurologist", "Orthopedic"]

export const symptomMapping = { 
    'Cold': [specialities[5], specialities[3]], 
    'BodyPain': [specialities[5],specialities[10]], 
    'Fever': [specialities[5]], 
    'Hearing Loss': [specialities[1], specialities[3]], 
    'Tooth Pain': [specialities[2]], 
    'Fracture': [specialities[12], specialities[7]],
    'MentalHealth': [specialities[7]], 
    'Lung Problem': [specialities[9]],    
}