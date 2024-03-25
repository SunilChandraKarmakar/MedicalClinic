namespace MedicalClinicWebApi.Model.ViewModels.Patient
{
    public class PatientViewModel
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int Age { get; set; }
        public int GanderId { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string UserId { get; set; }
        public string DoctroName { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string ProblemDescription { get; set; }
        public string? Address { get; set; }
    }
}