using MedicalClinicWebApi.DatabaseSetting;
using MedicalClinicWebApi.Model.Models;
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

        public PatientController(MedicalClinicWebApiDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<Patient>), (int) HttpStatusCode.OK)]
        public async Task<ActionResult<IEnumerable<Patient>>> GetPatients()
        {
            var patients = await _context.Patients.ToListAsync();
            return Ok(patients);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(Patient), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<Patient>> GetPatient(int id)
        {
            var patient = await _context.Patients.FindAsync(id);

            if (patient == null)
                return NotFound();

            return Ok(patient);
        }

        [HttpPut("{id}")]
        [ProducesResponseType(typeof(Patient), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<Patient>> Update(int id, Patient patient)
        {
            if (id != patient.Id)
                return BadRequest();

            _context.Entry(patient).State = EntityState.Modified;

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
        [ProducesResponseType(typeof(Patient), (int)HttpStatusCode.Created)]
        public async Task<ActionResult<Patient>> Create(Patient patient)
        {
            if(ModelState.IsValid)
            {
                _context.Patients.Add(patient);
                await _context.SaveChangesAsync();

                return Ok(patient);
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