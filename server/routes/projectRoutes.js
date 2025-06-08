const express = require('express');
const router = express.Router();
const Project = require('../models/Projects');
const { verifyToken, requiremanager } = require('../middleware/authMiddleware');

//  POST /api/projects (create project)
router.post('/', verifyToken, requiremanager, async (req, res) => {
  try {
    const {
      name,
      description,
      startDate,
      endDate,
      requiredSkills,
      teamSize,
      status,
    } = req.body;

    const project = new Project({
      name,
      description,
      startDate,
      endDate,
      requiredSkills,
      teamSize,
      status,
      managerId: req.user.id, // from verifyToken middleware
    });

    await project.save();
    res.status(201).json({ message: 'Project created successfully!', project });
  } catch (error) {
    console.error('Project creation error:', error);
    res.status(500).json({ message: 'Error creating project' });
  }
});

//  GET /api/projects (list all projects)
router.get('/', verifyToken, async (req, res) => {
  try {
    const projects = await Project.find().populate('managerId', 'name email');
    res.status(200).json(projects);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ message: 'Error fetching projects' });
  }
});

//  GET /api/projects/:id (get one project)
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('managerId', 'name email');
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json(project);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ message: 'Error fetching project' });
  }
});

module.exports = router;
