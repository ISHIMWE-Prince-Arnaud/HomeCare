tailwind.config = {
    theme: {
        extend: {
            rotate: {
                '180': '180deg',
            }
        }
    }
};

const servicePrices = {
    cleaning: { base: 50, unit: 'hr' },
    cooking: { base: 75, unit: 'hr' },
    plumbing: { base: 90, unit: 'hr' },
    handyman: { base: 65, unit: 'hr' },
    laundry: { base: 40, unit: 'load' },
    gardening: { base: 55, unit: 'hr' }
};

const durationOptions = {
    cleaning: ['1 hour', '2 hours', '3 hours', '4+ hours'],
    cooking: ['2 hours', '3 hours', '4 hours', '5+ hours'],
    plumbing: ['1 hour', '2 hours', '3 hours', '4+ hours'],
    handyman: ['1 hour', '2 hours', '3 hours', '4+ hours'],
    laundry: ['1 load', '2 loads', '3 loads', '4+ loads'],
    gardening: ['1 hour', '2 hours', '3 hours', '4+ hours']
};

document.getElementById('mobile-menu-button').addEventListener('click', function() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
});

let currentStep = 1;
const totalSteps = 3;

document.getElementById('service-date').min = new Date().toISOString().split('T')[0];

function showStep(step) {
    document.querySelectorAll('.form-step').forEach(el => {
        el.classList.remove('active');
    });
    document.getElementById(`step-${step}`).classList.add('active');
    currentStep = step;
}

document.querySelectorAll('.next-step').forEach(button => {
    button.addEventListener('click', function() {
        if (validateStep(currentStep)) {
            showStep(currentStep + 1);
            if (currentStep === 2) {
                updatePriceSummary();
            }
        }
    });
});

document.querySelectorAll('.prev-step').forEach(button => {
    button.addEventListener('click', function() {
        showStep(currentStep - 1);
    });
});

function validateStep(step) {
    let isValid = true;
    
    if (step === 1) {
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const address = document.getElementById('address').value.trim();
        
        if (!name) {
            document.getElementById('name-error').classList.add('show');
            isValid = false;
        } else {
            document.getElementById('name-error').classList.remove('show');
        }
        
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            document.getElementById('email-error').classList.add('show');
            isValid = false;
        } else {
            document.getElementById('email-error').classList.remove('show');
        }
        
        if (!phone) {
            document.getElementById('phone-error').classList.add('show');
            isValid = false;
        } else {
            document.getElementById('phone-error').classList.remove('show');
        }
        
        if (!address) {
            document.getElementById('address-error').classList.add('show');
            isValid = false;
        } else {
            document.getElementById('address-error').classList.remove('show');
        }
    } else if (step === 2) {
        const selectedServices = document.querySelectorAll('input[name="services[]"]:checked');
        
        if (selectedServices.length === 0) {
            document.getElementById('services-error').classList.add('show');
            isValid = false;
        } else {
            document.getElementById('services-error').classList.remove('show');
            
            selectedServices.forEach(service => {
                const serviceName = service.value;
                const durationSelect = document.getElementById(`${serviceName}-duration`);
                
                if (durationSelect && !durationSelect.value) {
                    document.getElementById(`${serviceName}-duration-error`).classList.add('show');
                    isValid = false;
                } else if (durationSelect) {
                    document.getElementById(`${serviceName}-duration-error`).classList.remove('show');
                }
            });
        }
    } else if (step === 3) {
        const date = document.getElementById('service-date').value;
        const time = document.getElementById('service-time').value;
        
        if (!date) {
            document.getElementById('date-error').classList.add('show');
            isValid = false;
        } else {
            document.getElementById('date-error').classList.remove('show');
        }
        
        if (!time) {
            document.getElementById('time-error').classList.add('show');
            isValid = false;
        } else {
            document.getElementById('time-error').classList.remove('show');
        }
    }
    
    return isValid;
}

document.querySelectorAll('.book-service-btn').forEach(button => {
    button.addEventListener('click', function() {
        const service = this.getAttribute('data-service');
        document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
        showStep(2);
        const checkbox = document.getElementById(`${service}-checkbox`);
        checkbox.checked = true;
        checkbox.dispatchEvent(new Event('change'));
    });
});

document.querySelectorAll('input[name="services[]"]').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        const serviceOption = this.closest('.service-option');
        if (this.checked) {
            serviceOption.classList.add('selected');
        } else {
            serviceOption.classList.remove('selected');
        }
        updateServiceDetails();
        updatePriceSummary();
    });
});

function updateServiceDetails() {
    const container = document.getElementById('service-details-container');
    container.innerHTML = '';
    
    const selectedServices = document.querySelectorAll('input[name="services[]"]:checked');
    
    selectedServices.forEach(service => {
        const serviceName = service.value;
        const serviceData = servicePrices[serviceName];
        const durations = durationOptions[serviceName];
        
        const serviceDiv = document.createElement('div');
        serviceDiv.className = 'bg-gray-50 p-5 rounded-lg border border-gray-200';
        serviceDiv.innerHTML = `
            <h4 class="font-bold mb-3 flex justify-between items-center">
                <span>${serviceName.charAt(0).toUpperCase() + serviceName.slice(1)} Service</span>
                <span class="text-blue-600">$${serviceData.base}/${serviceData.unit}</span>
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label for="${serviceName}-duration" class="block text-sm font-medium mb-1">Duration*</label>
                    <select id="${serviceName}-duration" name="${serviceName}-duration" class="w-full px-4 py-2 input-field focus:outline-none service-duration" data-service="${serviceName}">
                        <option value="">Select ${serviceData.unit}</option>
                        ${durations.map((opt, index) => 
                            `<option value="${index + 1}">${opt}</option>`
                        ).join('')}
                    </select>
                    <div class="error-message text-red-500 text-sm mt-1" id="${serviceName}-duration-error">Please select duration</div>
                </div>
                <div>
                    <label for="${serviceName}-notes" class="block text-sm font-medium mb-1">Special Instructions</label>
                    <input type="text" id="${serviceName}-notes" name="${serviceName}-notes" class="w-full px-4 py-2 input-field focus:outline-none" placeholder="Any specific requests...">
                </div>
            </div>
        `;
        
        container.appendChild(serviceDiv);
        
        document.getElementById(`${serviceName}-duration`).addEventListener('change', function() {
            updatePriceSummary();
        });
    });
}

function updatePriceSummary() {
    const summaryContainer = document.getElementById('price-summary');
    const totalPriceElement = document.getElementById('total-price');
    let total = 0;
    let summaryHTML = '';
    
    const selectedServices = document.querySelectorAll('input[name="services[]"]:checked');
    
    if (selectedServices.length === 0) {
        summaryHTML = '<p class="text-gray-600">Select services to see pricing</p>';
    } else {
        summaryHTML = '<div class="space-y-3">';
        
        selectedServices.forEach(service => {
            const serviceName = service.value;
            const serviceData = servicePrices[serviceName];
            const durationSelect = document.getElementById(`${serviceName}-duration`);
            let serviceTotal = 0;
            let quantity = 1;
            
            if (durationSelect && durationSelect.value) {
                quantity = parseInt(durationSelect.value);
                if (serviceData.unit === 'hr') {
                    serviceTotal = serviceData.base * quantity;
                } else {
                    serviceTotal = serviceData.base * quantity;
                }
            } else {
                serviceTotal = serviceData.base;
                quantity = 1;
            }
            
            total += serviceTotal;
            
            summaryHTML += `
                <div class="flex justify-between items-center">
                    <span class="font-medium">${serviceName.charAt(0).toUpperCase() + serviceName.slice(1)}</span>
                    <div class="text-right">
                        <div>${quantity} ${serviceData.unit}${quantity > 1 ? 's' : ''} × $${serviceData.base}</div>
                        <div class="font-semibold">$${serviceTotal}</div>
                    </div>
                </div>
            `;
        });
        
        summaryHTML += '</div>';
    }
    
    summaryContainer.innerHTML = summaryHTML;
    totalPriceElement.textContent = `$${total}`;
}

document.getElementById('booking-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (validateStep(currentStep)) {
        document.getElementById('confirmation-modal').classList.remove('hidden');
    }
});

document.getElementById('close-modal').addEventListener('click', function() {
    document.getElementById('confirmation-modal').classList.add('hidden');
    document.getElementById('booking-form').reset();
    showStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.querySelectorAll('.service-option').forEach(option => {
        option.classList.remove('selected');
    });
});

document.querySelectorAll('.service-option').forEach(option => {
    option.addEventListener('click', function(e) {
        if (e.target.tagName !== 'INPUT' && !e.target.closest('input')) {
            const checkbox = this.querySelector('input[type="checkbox"]');
            checkbox.checked = !checkbox.checked;
            checkbox.dispatchEvent(new Event('change'));
        }
    });
});

let currentTestimonial = 0;
const testimonials = document.querySelectorAll('.testimonial-slide');
const totalTestimonials = testimonials.length;
const slider = document.getElementById('testimonial-slider');

function showTestimonial(index) {
    const offset = -index * 100;
    slider.style.transform = `translateX(${offset}%)`;
    currentTestimonial = index;
}

document.getElementById('next-testimonial').addEventListener('click', function() {
    currentTestimonial = (currentTestimonial + 1) % totalTestimonials;
    showTestimonial(currentTestimonial);
});

document.getElementById('prev-testimonial').addEventListener('click', function() {
    currentTestimonial = (currentTestimonial - 1 + totalTestimonials) % totalTestimonials;
    showTestimonial(currentTestimonial);
});

showTestimonial(0);

document.querySelectorAll('.faq-toggle').forEach(toggle => {
    toggle.addEventListener('click', function() {
        const content = this.nextElementSibling;
        const icon = this.querySelector('i');
        
        content.classList.toggle('hidden');
        icon.classList.toggle('rotate-180');
    });
});