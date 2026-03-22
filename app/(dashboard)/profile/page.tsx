'use client';

import { useState, useEffect } from 'react';
import { 
  FiUser, FiHeart, FiActivity, FiBriefcase, FiAlertCircle, 
  FiChevronDown, FiEdit2, FiCheck 
} from 'react-icons/fi';
import styles from './profile.module.css';
import { useUser } from '../context/UserContext';

interface FieldConfig {
  key: string;
  label: string;
}

interface SectionConfig {
  key: string;
  title: string;
  icon: JSX.Element;
  fields: FieldConfig[];
}

const sectionConfigs: SectionConfig[] = [
  {
    key: 'personal',
    title: 'Personal Information',
    icon: <FiUser />,
    fields: [
      { key: 'name', label: 'Full Name' },
      { key: 'email', label: 'Email Address' },
      { key: 'phone', label: 'Phone Number' },
      { key: 'bloodType', label: 'Blood Type' },
    ]
  },
  {
    key: 'pregnancy',
    title: 'Pregnancy Information',
    icon: <FiHeart />,
    fields: [
      { key: 'dueDate', label: 'Due Date' },
      { key: 'gestation', label: 'Gestation' },
      { key: 'hospital', label: 'Delivery Hospital' },
    ]
  },
  {
    key: 'medical',
    title: 'Medical Information',
    icon: <FiActivity />,
    fields: [
      { key: 'allergies', label: 'Allergies' },
      { key: 'conditions', label: 'Medical Conditions' },
      { key: 'medications', label: 'Current Medications' },
    ]
  },
  {
    key: 'doctor',
    title: 'Care Team',
    icon: <FiBriefcase />,
    fields: [
      { key: 'primary', label: 'Primary Doctor' },
      { key: 'obgyn', label: 'OB/GYN' },
      { key: 'contact', label: 'Hospital Contact' },
    ]
  },
  {
    key: 'emergency',
    title: 'Emergency Contact',
    icon: <FiAlertCircle />,
    fields: [
      { key: 'name', label: 'Name' },
      { key: 'relation', label: 'Relationship' },
      { key: 'phone', label: 'Phone Number' },
    ]
  }
];

export default function ProfilePage() {
  const { user, profile, updateProfile, isLoading } = useUser();
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    personal: true,
    pregnancy: true,
  });

  const [editingSections, setEditingSections] = useState<{ [key: string]: boolean }>({});

  const [data, setData] = useState({
    personal: { name: '', email: '', phone: '', bloodType: '' },
    pregnancy: { dueDate: '', gestation: '', hospital: '' },
    medical: { allergies: '', conditions: '', medications: '' },
    doctor: { primary: '', obgyn: '', contact: '' },
    emergency: { name: '', relation: '', phone: '' },
  });

  const [prevProfile, setPrevProfile] = useState(profile);

  if (profile !== prevProfile) {
    setPrevProfile(profile);
    setData({
      personal: { 
        name: user?.name || '', 
        email: user?.email || '', 
        phone: profile?.phoneNumber || '', 
        bloodType: 'O+' 
      },
      pregnancy: { 
        dueDate: profile?.pregnancyStartDate ? new Date(profile.pregnancyStartDate).toISOString().split('T')[0] : '', 
        gestation: profile?.gestationalAgeDays ? `${Math.floor(profile.gestationalAgeDays / 7)} weeks` : '', 
        hospital: "St. Mary's Maternity" 
      },
      medical: { 
        allergies: profile?.allergies?.join(', ') || '', 
        conditions: 'None', 
        medications: profile?.medications?.join(', ') || '' 
      },
      doctor: { 
        primary: profile?.doctor?.name || '', 
        obgyn: 'Dr. Bob Smith', 
        contact: profile?.doctor?.phone || '' 
      },
      emergency: { 
        name: profile?.emergencyContact?.name || '', 
        relation: 'Spouse', 
        phone: profile?.emergencyContact?.phone || '' 
      },
    });
  }

  const toggleExpand = (key: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const toggleEdit = async (e: React.MouseEvent, key: string) => {
    e.stopPropagation();
    const isEditing = editingSections[key];

    if (isEditing) {
      const success = await updateProfile({
        phoneNumber: data.personal.phone,
        medications: data.medical.medications.split(',').map(m => m.trim()).filter(Boolean),
        allergies: data.medical.allergies.split(',').map(m => m.trim()).filter(Boolean),
        doctor: {
          name: data.doctor.primary,
          phone: data.doctor.contact,
        },
        emergencyContact: {
          name: data.emergency.name,
          phone: data.emergency.phone,
        }
      });
    }

    setEditingSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (isLoading) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: '#6B7280' }}>Loading profile...</div>;
  }

  const handleChange = (sectionKey: string, fieldKey: string, value: string) => {
    setData(prev => ({
      ...prev,
      [sectionKey]: {
        ...(prev as any)[sectionKey],
        [fieldKey]: value
      }
    }));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Profile</h1>

      {sectionConfigs.map((section) => {
        const isExpanded = expandedSections[section.key];
        const isEditing = editingSections[section.key];
        const sectionData = (data as any)[section.key];

        return (
          <div 
            key={section.key} 
            className={`${styles.card} ${isExpanded ? styles.expanded : ''}`}
          >
            <div className={styles.cardHeader} onClick={() => toggleExpand(section.key)}>
              <div className={styles.headerLeft}>
                <span className={styles.icon}>{section.icon}</span>
                <h2>{section.title}</h2>
              </div>
              <div className={styles.headerRight}>
                <button 
                  className={styles.actionBtn} 
                  onClick={(e) => toggleEdit(e, section.key)}
                  title={isEditing ? "Save" : "Edit"}
                >
                  {isEditing ? <FiCheck /> : <FiEdit2 />}
                </button>
                <FiChevronDown className={`${styles.chevron} ${isExpanded ? styles.rotate : ''}`} />
              </div>
            </div>

            <div className={styles.cardBody}>
              <div className={styles.cardContent}>
                <div className={styles.innerContent}>
                  <div className={styles.grid}>
                    {section.fields.map((field) => (
                      <div className={styles.fieldItem} key={field.key}>
                        <label className={styles.fieldLabel}>{field.label}</label>
                        {isEditing ? (
                          <input 
                            type="text" 
                            value={sectionData[field.key] || ''} 
                            onChange={(e) => handleChange(section.key, field.key, e.target.value)}
                            className={styles.fieldInput}
                            autoFocus={field.key === section.fields[0].key}
                          />
                        ) : (
                          <p className={styles.fieldValue}>{sectionData[field.key] || '—'}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
