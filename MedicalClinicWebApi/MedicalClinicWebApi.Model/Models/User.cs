using Microsoft.AspNetCore.Identity;

namespace MedicalClinicWebApi.Model.Models
{
    public class User : IdentityUser
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int UserTypeId { get; set; }

        public UserType UserType { get; set; }
    }
}