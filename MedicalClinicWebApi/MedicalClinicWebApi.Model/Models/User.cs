using Microsoft.AspNetCore.Identity;

namespace MedicalClinicWebApi.Model.Models
{
    public class User : IdentityUser
    {
        public User()
        {
            Patients = new HashSet<Patient>();
        }

        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int UserTypeId { get; set; }

        public UserType UserType { get; set; }
        public ICollection<Patient> Patients { get; set; }
    }
}