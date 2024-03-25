using System.ComponentModel.DataAnnotations;

namespace MedicalClinicWebApi.Model.ViewModels.Patient
{
    public class PatientEditModel
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Please, provied first name.")]
        [StringLength(30, MinimumLength = 2)]
        public string FirstName { get; set; }

        [Required(ErrorMessage = "Please, provied last name.")]
        [StringLength(30, MinimumLength = 2)]
        public string LastName { get; set; }

        [Required(ErrorMessage = "Please, provied age.")]
        public int Age { get; set; }

        [Required(ErrorMessage = "Please, select gender.")]
        public int GanderId { get; set; }

        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }

        [Required(ErrorMessage = "Please, select user id.")]
        public string UserId { get; set; }

        [Required(ErrorMessage = "Please, select appointment date.")]
        [DataType(DataType.DateTime)]
        public DateTime AppointmentDate { get; set; }

        [Required(ErrorMessage = "Please, provied problem description.")]
        [StringLength(1000, MinimumLength = 2)]
        public string ProblemDescription { get; set; }

        public string? Address { get; set; }
    }
}