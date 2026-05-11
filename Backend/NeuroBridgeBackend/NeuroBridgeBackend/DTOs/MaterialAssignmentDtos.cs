namespace NeuroBridgeBackend.DTOs
{
    public class AssignMaterialRequest
    {
        public int? UserId { get; set; }
        public string? AssignedRole { get; set; }
        public int? UserGroupId { get; set; }
    }

    public class MaterialAssignmentDto
    {
        public int Id { get; set; }
        public int MaterialId { get; set; }
        public int? UserId { get; set; }
        public string? UserEmail { get; set; }
        public string? AssignedRole { get; set; }
        public int? UserGroupId { get; set; }
        public string? UserGroupName { get; set; }
        public DateTime AssignedAt { get; set; }
    }
}
