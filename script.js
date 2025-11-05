// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Close mobile menu if open
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(26, 26, 26, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(26, 26, 26, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Form submission handlers are now in index.html inline scripts

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.feature-card, .pillar-card, .comparison-card');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Counter animation for stats
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const updateCounter = () => {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start).toLocaleString();
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toLocaleString();
        }
    };
    
    updateCounter();
}

// Trigger counter animation when stats are visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            entry.target.classList.add('counted');
            const target = parseInt(entry.target.textContent.replace(/,/g, ''));
            animateCounter(entry.target, target);
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.stat-number').forEach(stat => {
        statsObserver.observe(stat);
    });
});

// Share functionality
function shareOnSocial(platform) {
    const url = window.location.href;
    const text = "Support nursing interns in Sindh! Join the Pen4PAY movement for fair stipends.";
    
    let shareUrl;
    switch(platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
            break;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }
}

// Add click handlers to share buttons
document.addEventListener('DOMContentLoaded', function() {
    const shareModal = document.getElementById('shareModal');
    if (shareModal) {
        shareModal.querySelectorAll('.btn').forEach((btn, index) => {
            const platforms = ['facebook', 'twitter', 'instagram', 'linkedin'];
            btn.addEventListener('click', () => {
                if (platforms[index] === 'instagram') {
                    alert('To share on Instagram:\n1. Take a screenshot\n2. Open Instagram Stories\n3. Upload and tag #Pen4PAY');
                } else {
                    shareOnSocial(platforms[index]);
                }
            });
        });
    }
});

// Copy letter to clipboard
function copyLetter() {
    const letterContent = document.getElementById('letterContent').innerText;
    
    navigator.clipboard.writeText(letterContent).then(() => {
        showCopySuccess();
    }).catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy. Please try selecting and copying manually.');
    });
}

// Show copy success notification
function showCopySuccess() {
    const notification = document.createElement('div');
    notification.className = 'copy-success';
    notification.innerHTML = '<i class="bi bi-check-circle-fill me-2"></i>Letter copied to clipboard!';
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Download letter as PDF with improved formatting - Works on all devices
function downloadLetter() {
    // Show loading notification
    const loadingNotification = document.createElement('div');
    loadingNotification.className = 'copy-success';
    loadingNotification.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Preparing PDF...';
    document.body.appendChild(loadingNotification);
    
    // Try modern approach first (html2canvas + jsPDF)
    if (typeof html2canvas !== 'undefined' && typeof jspdf !== 'undefined') {
        generatePDFWithLibrary();
    } else {
        // Fallback to print dialog method
        generatePDFWithPrint();
    }
    
    // Remove loading notification
    setTimeout(() => {
        loadingNotification.remove();
    }, 1000);
}

// Method 1: Generate PDF using jsPDF and html2canvas (better for mobile)
function generatePDFWithLibrary() {
    const { jsPDF } = window.jspdf;
    
    // Create a clean version of the letter for PDF
    const letterContent = document.getElementById('letterContent').cloneNode(true);
    
    // Remove buttons and interactive elements
    const buttons = letterContent.querySelectorAll('button');
    buttons.forEach(btn => btn.remove());
    
    // Remove the address section (Where to send)
    const addressSection = letterContent.querySelector('.letter-address');
    if (addressSection) {
        addressSection.remove();
    }
    
    // Create temporary container with minimal styling for one page
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.width = '185mm'; // A4 width minus margins (210mm - 25mm)
    tempContainer.style.padding = '0';
    tempContainer.style.background = 'white';
    tempContainer.style.fontFamily = 'Times New Roman, Georgia, serif';
    tempContainer.style.fontSize = '10pt';
    tempContainer.style.lineHeight = '1.4';
    tempContainer.style.color = '#000';
    
    // Apply compact styles to letter elements
    const letterTo = letterContent.querySelector('.letter-to');
    const letterSubject = letterContent.querySelector('.letter-subject');
    const letterSalutation = letterContent.querySelector('.letter-salutation');
    const letterContentDiv = letterContent.querySelector('.letter-content');
    const letterClosing = letterContent.querySelector('.letter-closing');
    const signatureFields = letterContent.querySelector('.signature-fields');
    
    if (letterTo) letterTo.style.marginBottom = '0.8rem';
    if (letterSubject) {
        letterSubject.style.marginBottom = '0.8rem';
        letterSubject.style.padding = '0.4rem';
    }
    if (letterSalutation) letterSalutation.style.marginBottom = '0.6rem';
    if (letterContentDiv) {
        letterContentDiv.style.marginBottom = '0.8rem';
        const paragraphs = letterContentDiv.querySelectorAll('p');
        paragraphs.forEach(p => p.style.marginBottom = '0.6rem');
    }
    if (letterClosing) letterClosing.style.marginBottom = '0.8rem';
    if (signatureFields) {
        signatureFields.style.marginTop = '0.8rem';
        signatureFields.style.padding = '0.8rem';
        const formFields = signatureFields.querySelectorAll('.form-field');
        formFields.forEach(field => {
            field.style.marginBottom = '0.5rem';
            const label = field.querySelector('label');
            if (label) label.style.fontSize = '9pt';
        });
    }
    
    tempContainer.appendChild(letterContent);
    document.body.appendChild(tempContainer);
    
    // Generate PDF
    html2canvas(tempContainer, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
    }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        // 0.5 inch margins = 12.7mm
        const margin = 12.7;
        const imgWidth = 210 - (margin * 2); // A4 width minus margins
        const pageHeight = 297 - (margin * 2); // A4 height minus margins
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        // Add image with margins
        pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);
        
        // Only add second page if absolutely necessary
        if (imgHeight > pageHeight) {
            const remainingHeight = imgHeight - pageHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', margin, margin - pageHeight, imgWidth, imgHeight);
        }
        
        // Download the PDF
        pdf.save('Letter_to_PNMC_Pen4PAY.pdf');
        
        // Clean up
        document.body.removeChild(tempContainer);
        
        // Show success notification
        showCopySuccess('PDF downloaded successfully!');
    }).catch(error => {
        console.error('PDF generation failed:', error);
        document.body.removeChild(tempContainer);
        // Fallback to print method
        generatePDFWithPrint();
    });
}

// Method 2: Fallback print dialog method (works everywhere)
function generatePDFWithPrint() {
    const letterContent = document.getElementById('letterContent').cloneNode(true);
    
    // Remove buttons and interactive elements
    const buttons = letterContent.querySelectorAll('button');
    buttons.forEach(btn => btn.remove());
    
    // Remove the address section (Where to send)
    const addressSection = letterContent.querySelector('.letter-address');
    if (addressSection) {
        addressSection.remove();
    }
    
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    
    if (!printWindow) {
        alert('Please allow pop-ups to download the PDF. Then try again.');
        return;
    }
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Letter to PNMC - Pen4PAY Campaign</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    font-family: 'Times New Roman', 'Georgia', serif;
                    padding: 0;
                    margin: 1.27cm;
                    line-height: 1.4;
                    color: #000;
                    background: #fff;
                    font-size: 10pt;
                }
                
                .letter-to {
                    margin-bottom: 0.8rem;
                    line-height: 1.3;
                }
                
                .letter-to strong {
                    display: block;
                    margin-bottom: 0.2rem;
                    font-size: 10.5pt;
                }
                
                .letter-subject {
                    margin-bottom: 0.8rem;
                    padding: 0.4rem;
                    background: rgba(0, 102, 255, 0.05);
                    border-left: 3px solid #0066FF;
                }
                
                .letter-subject strong {
                    font-size: 10.5pt;
                }
                
                .letter-salutation {
                    margin-bottom: 0.6rem;
                    font-size: 10.5pt;
                }
                
                .letter-content {
                    margin-bottom: 0.8rem;
                }
                
                .letter-content p {
                    margin-bottom: 0.6rem;
                    text-align: justify;
                    line-height: 1.4;
                }
                
                .letter-closing {
                    margin-bottom: 0.8rem;
                }
                
                .signature-fields {
                    margin-top: 0.8rem;
                    padding: 0.8rem;
                    background: #f8f9fa;
                    border-radius: 6px;
                }
                
                .form-field {
                    margin-bottom: 0.5rem;
                }
                
                .form-field label {
                    font-weight: 600;
                    display: block;
                    margin-bottom: 0.15rem;
                    font-size: 9pt;
                }
                
                .field-line {
                    border-bottom: 1px solid #333;
                    padding: 0.25rem 0;
                    min-height: 22px;
                }
                
                .row {
                    display: flex;
                    flex-wrap: wrap;
                    margin: 0 -0.75rem;
                }
                
                .col-md-6 {
                    flex: 0 0 50%;
                    max-width: 50%;
                    padding: 0 0.75rem;
                }
                
                .letter-address {
                    margin-top: 2rem;
                    padding: 1.5rem;
                    background: #f0f9ff;
                    border: 2px solid #0066FF;
                    border-radius: 8px;
                }
                
                .letter-address strong {
                    font-size: 12pt;
                    display: block;
                    margin-bottom: 0.5rem;
                }
                
                .letter-address a {
                    color: #0066FF;
                    text-decoration: none;
                    font-weight: 600;
                }
                
                .alert {
                    padding: 0;
                    background: transparent;
                    border: none;
                }
                
                .alert i {
                    display: none;
                }
                
                /* Print-specific styles */
                @media print {
                    body {
                        padding: 0;
                        margin: 1.27cm;
                    }
                    
                    .signature-fields {
                        background: transparent;
                        page-break-inside: avoid;
                    }
                    
                    .letter-address {
                        display: none;
                    }
                    
                    @page {
                        margin: 1.27cm;
                        size: A4 portrait;
                    }
                }
                
                /* Mobile responsive */
                @media screen and (max-width: 768px) {
                    body {
                        padding: 1cm;
                        font-size: 11pt;
                    }
                    
                    .col-md-6 {
                        flex: 0 0 100%;
                        max-width: 100%;
                    }
                    
                    .letter-subject,
                    .signature-fields,
                    .letter-address {
                        padding: 1rem;
                    }
                }
            </style>
        </head>
        <body>
            ${letterContent.innerHTML}
            <script>
                // Auto-print on load
                window.onload = function() {
                    // Small delay to ensure content is rendered
                    setTimeout(function() {
                        window.print();
                    }, 250);
                };
                
                // Optional: Close window after printing
                window.onafterprint = function() {
                    // Uncomment to auto-close after printing
                    // setTimeout(() => window.close(), 500);
                };
            </script>
        </body>
        </html>
    `);
    
    printWindow.document.close();
}

// Quick send form handler is now in index.html inline scripts

console.log('Pen4PAY - Fighting for nursing justice in Sindh 💙');


// ===== SHARE CAMPAIGN FUNCTIONALITY =====

// Share Campaign Messages
const shareMessages = {
    1: "Nursing interns in Sindh work 8-12 hour shifts WITHOUT any stipend, while other provinces provide financial support. This is unjust! Join #Pen4PAY to demand fair stipends for our healthcare heroes. 🩺💙 #NursingJustice #SindhNurses #HealthcareHeroes #PNMC",
    2: "Punjab ✅ KPK ✅ Balochistan ✅ provide stipends to nursing interns. Sindh ❌ does NOT. Why are Sindh's nursing students left behind? Support #Pen4PAY for equal treatment! 🏥 #FairPay #NursingInterns #SindhHealthcare #StudentRights",
    3: "Nursing students serve on the frontlines of healthcare, yet Sindh offers them ZERO financial support. According to PNMC's Internship Policy 2021, they deserve BPS-16 stipends. Stand with us! 💪 #Pen4PAY #NursingRights #SindhNurses #HealthcareEquality"
};

// Get selected message
function getSelectedMessage() {
    const selectedRadio = document.querySelector('input[name="messageOption"]:checked');
    const messageNum = selectedRadio ? selectedRadio.closest('.message-card').dataset.message : '1';
    return shareMessages[messageNum];
}

// Copy share message
function copyShareMessage() {
    const message = getSelectedMessage();
    
    navigator.clipboard.writeText(message).then(() => {
        showCopySuccess('Message copied! Now paste it on your social media.');
    }).catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy. Please try selecting and copying manually.');
    });
}

// Copy hashtags
function copyHashtags() {
    const hashtags = "#Pen4PAY #NursingJustice #SindhNurses #HealthcareHeroes #FairPay #NursingInterns #PNMC #StudentRights";
    
    navigator.clipboard.writeText(hashtags).then(() => {
        showCopySuccess('Hashtags copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
}

// Share on different platforms
function shareOnPlatform(platform) {
    const url = window.location.href;
    const message = getSelectedMessage();
    const title = "Pen4PAY - Fair Stipends for Nursing Interns";
    
    let shareUrl;
    
    switch(platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(message)}`;
            window.open(shareUrl, '_blank', 'width=600,height=400');
            break;
            
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(url)}`;
            window.open(shareUrl, '_blank', 'width=600,height=400');
            break;
            
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${encodeURIComponent(message + ' ' + url)}`;
            window.open(shareUrl, '_blank');
            break;
            
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
            window.open(shareUrl, '_blank', 'width=600,height=400');
            break;
            
        case 'telegram':
            shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(message)}`;
            window.open(shareUrl, '_blank');
            break;
            
        case 'instagram':
            alert('To share on Instagram:\n\n1. Copy the message using the button above\n2. Take a screenshot of this page\n3. Open Instagram Stories\n4. Upload the screenshot\n5. Paste the message and add #Pen4PAY\n\nThank you for spreading awareness! 💙');
            break;
    }
}

// Message card selection handler
document.addEventListener('DOMContentLoaded', function() {
    const messageCards = document.querySelectorAll('.message-card');
    
    messageCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove active class from all cards
            messageCards.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked card
            this.classList.add('active');
            
            // Check the radio button
            const radio = this.querySelector('input[type="radio"]');
            if (radio) {
                radio.checked = true;
            }
        });
    });
});
