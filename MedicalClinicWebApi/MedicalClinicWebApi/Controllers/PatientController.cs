using AutoMapper;
using MedicalClinicWebApi.DatabaseSetting;
using MedicalClinicWebApi.Model.Models;
using MedicalClinicWebApi.Model.ViewModels.Patient;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace MedicalClinicWebApi.Controllers
{
    [Route("api/[controller]/[action]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [ApiController]
    public class PatientController : ControllerBase
    {
        private readonly MedicalClinicWebApiDbContext _context;
        private readonly IMapper _mapper;

        public PatientController(MedicalClinicWebApiDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<PatientViewModel>), (int) HttpStatusCode.OK)]
        public async Task<ActionResult<IEnumerable<PatientViewModel>>> GetUpcommingPatients()
        {
            var patients = await _context.Patients
                           .Include(p => p.User)
                           .Where(p => p.AppointmentDate > DateTime.Now)
                           .ToListAsync();

            var mapPatients = _mapper.Map<IEnumerable<PatientViewModel>>(patients);
            return Ok(mapPatients);
        }

        [HttpGet("{doctroId}")]
        [ProducesResponseType(typeof(IEnumerable<PatientViewModel>), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<IEnumerable<PatientViewModel>>> GetUpcommingPatientsByDoctroId(string doctroId)
        {
            if (string.IsNullOrEmpty(doctroId) || string.IsNullOrWhiteSpace(doctroId))
                return BadRequest();

            var patients = await _context.Patients
                           .Include(p => p.User)
                           .Where(p => p.AppointmentDate > DateTime.Now && p.UserId == doctroId)
                           .ToListAsync();

            var mapPatients = _mapper.Map<IEnumerable<PatientViewModel>>(patients);
            return Ok(mapPatients);
        }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<PatientViewModel>), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<IEnumerable<PatientViewModel>>> GetPreviousPatients()
        {
            var patients = await _context.Patients
                          .Include(p => p.User)
                          .Where(p => p.AppointmentDate < DateTime.Now)
                          .ToListAsync();

            var mapPatients = _mapper.Map<IEnumerable<PatientViewModel>>(patients);
            return Ok(mapPatients);
        }

        [HttpGet("{doctroId}")]
        [ProducesResponseType(typeof(IEnumerable<PatientViewModel>), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<IEnumerable<PatientViewModel>>> GetPreviousPatientsByDoctroId(string doctroId)
        {
            if (string.IsNullOrEmpty(doctroId) || string.IsNullOrWhiteSpace(doctroId))
                return BadRequest();

            var patients = await _context.Patients
                          .Include(p => p.User)
                          .Where(p => p.AppointmentDate < DateTime.Now && p.UserId == doctroId)
                          .ToListAsync();

            var mapPatients = _mapper.Map<IEnumerable<PatientViewModel>>(patients);
            return Ok(mapPatients);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(PatientEditModel), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<PatientEditModel>> GetPatient(int id)
        {
            var patient = await _context.Patients.FindAsync(id);

            if (patient == null)
                return NotFound();

            var patientEditModel = _mapper.Map<PatientEditModel>(patient);
            return Ok(patientEditModel);
        }

        [HttpPut("{id}")]
        [ProducesResponseType(typeof(PatientEditModel), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<PatientEditModel>> Update(int id, PatientEditModel patient)
        {
            if (id != patient.Id)
                return BadRequest();

            var mapPatient = _mapper.Map<Patient>(patient);
            _context.Entry(mapPatient).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PatientExists(id))
                    return NotFound();
                else
                    throw;
            }

            return Ok(patient);
        }

        [HttpPost]
        [ProducesResponseType(typeof(PatientCreateModel), (int)HttpStatusCode.Created)]
        public async Task<ActionResult<PatientCreateModel>> Create(PatientCreateModel patient)
        {
            if(ModelState.IsValid)
            {
                var mapPatient = _mapper.Map<Patient>(patient);
                _context.Patients.Add(mapPatient);
                await _context.SaveChangesAsync();

                var patientCreateModel = _mapper.Map<PatientCreateModel>(mapPatient);
                return Ok(patientCreateModel);
            }

            return BadRequest();
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(int), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<int>> Delete(int id)
        {
            var patient = await _context.Patients.FindAsync(id);
            if (patient == null)
                return NotFound();

            _context.Patients.Remove(patient);
            await _context.SaveChangesAsync();

            return Ok(patient.Id);
        }

        private bool PatientExists(int id)
        {
            return _context.Patients.Any(e => e.Id == id);
        }
    }
}