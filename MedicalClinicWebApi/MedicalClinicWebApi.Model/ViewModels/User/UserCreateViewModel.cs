using System.ComponentModel.DataAnnotations;

namespace MedicalClinicWebApi.Model.ViewModels.User
{
    public class UserCreateViewModel
    {
        [Required(ErrorMessage = "Please, provied first name.")]
        [StringLength(50, MinimumLength = 2)]
        public string FirstName { get; set; }

        [Required(ErrorMessage = "Please, provied last name.")]
        [StringLength(50, MinimumLength = 2)]
        public string LastName { get; set; }

        [Required(ErrorMessage = "Please, provied email address.")]
        [StringLength(100, MinimumLength = 11)]
        [DataType(DataType.EmailAddress)]
        public string Email { get; set; }

        [Required(ErrorMessage = "Please, provied strong password")]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        [Required(ErrorMessage = "Please, provied phone number.")]
        [StringLength(20, MinimumLength = 2)]
        public string PhoneNumber { get; set; }

        [Required(ErrorMessage = "Please, select user type")]
        public int UserTypeId { get; set; }
    }
}